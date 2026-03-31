import type { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { Product, Review, Variant } from "../models/index.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { applyStoreScope } from "../utils/storeScope.js";
import { requireFields } from "../utils/validation.js";
import { generateSlug, ensureUniqueSlug } from "../utils/slug.js";
import { getPaginationParams, formatPaginatedResponse } from "../utils/pagination.js";
import { sequelize } from "../config/dbConfig.js";

const buildPriceExpression = () => {
  return Sequelize.literal(`COALESCE(
    (SELECT v.price FROM variants v WHERE v.product_id = products.id ORDER BY v.default DESC, v.id ASC LIMIT 1),
    products.price
  )`);
};

const buildComparePriceExpression = () => {
  return Sequelize.literal(`COALESCE(
    (SELECT v.compare_price FROM variants v WHERE v.product_id = products.id ORDER BY v.default DESC, v.id ASC LIMIT 1),
    products.compare_price
  )`);
};

const listProducts = async (req: Request, res: Response) => {
  try {
    const { categoryId, minPrice, maxPrice, search, limit, offset } = req.query;
    const storeId = req.storeId ?? String(req.query.storeId ?? "");
    if (!storeId) {
      return sendError(res, "storeId is required", 400);
    }

    const pagination = getPaginationParams(limit, offset);

    const where = applyStoreScope(storeId, {}) as Record<string | symbol, unknown>;

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    if (search) {
      where.name = { [Op.iLike]: `%${String(search)}%` };
    }

    const priceClauses = [];
    const priceExpr = buildPriceExpression();

    if (minPrice !== undefined) {
      priceClauses.push(Sequelize.where(priceExpr, { [Op.gte]: Number(minPrice) }));
    }
    if (maxPrice !== undefined) {
      priceClauses.push(Sequelize.where(priceExpr, { [Op.lte]: Number(maxPrice) }));
    }
    if (priceClauses.length) {
      (where as Record<symbol, unknown>)[Op.and] = priceClauses;
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      attributes: [
        "id",
        "storeId",
        "categoryId",
        "name",
        "slug",
        "price",
        "comparePrice",
        "primaryImage",
        "isActive",
        "inStock",
        "createdAt",
      ],
      include: [
        {
          model: Variant,
          as: "variants",
          attributes: ["id", "price", "comparePrice", "default"],
        },
      ],
      order: [["id", "ASC"]],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    const response = rows.map((product) => {
      const variants = ((product as Product & { variants?: Variant[] }).variants ??
        []) as Variant[];
      const defaultVariant =
        variants.find((variant) => variant.default) ?? variants[0] ?? null;
      return {
        ...product.toJSON(),
        displayPrice: defaultVariant?.price ?? product.price,
        displayComparePrice: defaultVariant?.comparePrice ?? product.comparePrice,
      };
    });

    return sendSuccess(
      res,
      formatPaginatedResponse(response, count, pagination),
      "Products"
    );
  } catch (error) {
    return sendError(
      res,
      `Failed to list products: ${error instanceof Error ? error.message : "Unknown error"}`,
      500
    );
  }
};

const getProductDetail = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    return sendError(res, "Invalid product id", 400);
  }

  const storeId = req.storeId ?? String(req.query.storeId ?? "");
  if (!storeId) {
    return sendError(res, "storeId is required", 400);
  }

  const product = await Product.findOne({
    where: applyStoreScope(storeId, { id: productId }),
    attributes: [
      "id",
      "storeId",
      "categoryId",
      "name",
      "slug",
      "description",
      "tag",
      "price",
      "comparePrice",
      "primaryImage",
      "secondaryImage",
      "isActive",
      "inStock",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Variant,
        as: "variants",
        attributes: [
          "id",
          "productId",
          "name",
          "value",
          "price",
          "comparePrice",
          "image",
          "default",
          "isActive",
        ],
      },
      {
        model: Review,
        as: "reviews",
        attributes: [
          "id",
          "productId",
          "userId",
          "rating",
          "comment",
          "image",
          "isApproved",
          "createdAt",
        ],
      },
    ],
  });

  if (!product) {
    return sendError(res, "Product not found", 404);
  }

  return sendSuccess(res, product, "Product detail");
};

const createProduct = async (req: Request, res: Response) => {
  const missing = requireFields(req.body, ["name", "price"]);
  if (missing.length) {
    return sendError(res, `Missing fields: ${missing.join(", ")}`, 400);
  }

  // Generate slug from product name
  const baseSlug = generateSlug(String(req.body.name));
  const existingProducts = await Product.findAll({
    where: applyStoreScope(req.storeId!, {}),
    attributes: ["slug"],
  });
  const existingSlugs = existingProducts.map((p) => p.slug);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);

  const payload = {
    storeId: req.storeId!,
    categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
    name: String(req.body.name),
    slug,
    description: req.body.description ? String(req.body.description) : null,
    tag: req.body.tag ? String(req.body.tag) : null,
    primaryImage: req.body.primaryImage ? String(req.body.primaryImage) : null,
    secondaryImage: req.body.secondaryImage ? String(req.body.secondaryImage) : null,
    price: Number(req.body.price),
    comparePrice: req.body.comparePrice ? Number(req.body.comparePrice) : null,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
  };

  const variants = Array.isArray(req.body.variants) ? req.body.variants : [];

  const product = await sequelize.transaction(async (trx) => {
    const created = await Product.create(payload, { transaction: trx });
    if (variants.length) {
      const variantRows = variants.map((variant: Record<string, unknown>) => ({
        productId: created.id,
        name: String(variant.name ?? "Default"),
        value: String(variant.value ?? ""),
        image: variant.image ? String(variant.image) : null,
        price: Number(variant.price ?? payload.price),
        comparePrice: variant.comparePrice ? Number(variant.comparePrice) : null,
        default: variant.default !== undefined ? Boolean(variant.default) : false,
        isActive: variant.isActive !== undefined ? Boolean(variant.isActive) : true,
      }));
      await Variant.bulkCreate(variantRows, { transaction: trx });
    }
    return created;
  });

  return sendSuccess(res, product, "Product created", 201);
};

const updateProduct = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    return sendError(res, "Invalid product id", 400);
  }

  const product = await Product.findOne({
    where: applyStoreScope(req.storeId!, { id: productId }),
  });
  if (!product) {
    return sendError(res, "Product not found", 404);
  }

  const updates: Record<string, unknown> = {};
  if (req.body.categoryId !== undefined) {
    updates.categoryId = req.body.categoryId ? Number(req.body.categoryId) : null;
  }
  if (req.body.name) {
    updates.name = String(req.body.name);
    // Regenerate slug if name changes
    const baseSlug = generateSlug(String(req.body.name));
    const otherProducts = await Product.findAll({
      where: applyStoreScope(req.storeId!, { id: { [Op.ne]: productId } }),
      attributes: ["slug"],
    });
    const otherSlugs = otherProducts.map((p) => p.slug);
    updates.slug = ensureUniqueSlug(baseSlug, otherSlugs);
  }
  if (req.body.description !== undefined) {
    updates.description = req.body.description ? String(req.body.description) : null;
  }
  if (req.body.tag !== undefined) updates.tag = req.body.tag ? String(req.body.tag) : null;
  if (req.body.primaryImage !== undefined) {
    updates.primaryImage = req.body.primaryImage ? String(req.body.primaryImage) : null;
  }
  if (req.body.secondaryImage !== undefined) {
    updates.secondaryImage = req.body.secondaryImage
      ? String(req.body.secondaryImage)
      : null;
  }
  if (req.body.price !== undefined) updates.price = Number(req.body.price);
  if (req.body.comparePrice !== undefined) {
    updates.comparePrice = req.body.comparePrice
      ? Number(req.body.comparePrice)
      : null;
  }
  if (req.body.isActive !== undefined) updates.isActive = Boolean(req.body.isActive);

  const variants = Array.isArray(req.body.variants) ? req.body.variants : [];

  await sequelize.transaction(async (trx) => {
    await product.update(updates, { transaction: trx });

    for (const variant of variants as Array<Record<string, unknown>>) {
      if (variant.id) {
        await Variant.update(
          {
            name: variant.name ? String(variant.name) : undefined,
            value: variant.value ? String(variant.value) : undefined,
            image: variant.image ? String(variant.image) : null,
            price: variant.price !== undefined ? Number(variant.price) : undefined,
            comparePrice:
              variant.comparePrice !== undefined
                ? Number(variant.comparePrice)
                : null,
            default:
              variant.default !== undefined ? Boolean(variant.default) : undefined,
            isActive:
              variant.isActive !== undefined ? Boolean(variant.isActive) : undefined,
          },
          {
            where: { id: Number(variant.id), productId: product.id },
            transaction: trx,
          }
        );
      } else {
        await Variant.create(
          {
            productId: product.id,
            name: String(variant.name ?? "Default"),
            value: String(variant.value ?? ""),
            image: variant.image ? String(variant.image) : null,
            price: Number(variant.price ?? product.price),
            comparePrice: variant.comparePrice ? Number(variant.comparePrice) : null,
            default: variant.default !== undefined ? Boolean(variant.default) : false,
            isActive: variant.isActive !== undefined ? Boolean(variant.isActive) : true,
          },
          { transaction: trx }
        );
      }
    }
  });

  return sendSuccess(res, product, "Product updated");
};

const deleteProduct = async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    return sendError(res, "Invalid product id", 400);
  }

  const product = await Product.findOne({
    where: applyStoreScope(req.storeId!, { id: productId }),
  });
  if (!product) {
    return sendError(res, "Product not found", 404);
  }

  await product.destroy();
  return sendSuccess(res, { id: product.id }, "Product deleted");
};

export {
  createProduct,
  deleteProduct,
  getProductDetail,
  listProducts,
  updateProduct,
};
