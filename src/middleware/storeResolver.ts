import type { Request, Response, NextFunction } from "express";
import { Store } from "../models/index.js";

/**
 * Middleware to resolve store_slug query parameter to storeId
 * Sets req.storeId if store_slug is provided and valid
 */
export const resolveStoreSlug = async (req: Request, res: Response, next: NextFunction) => {
  const { store_slug } = req.query;

  if (store_slug && typeof store_slug === 'string') {
    try {
      const store = await Store.findOne({
        where: { slug: store_slug },
        attributes: ['id'],
      });

      if (store) {
        req.storeId = String(store.id);
      } else {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }
    } catch (error) {
      console.error("Error resolving store slug:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  next();
};