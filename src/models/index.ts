import type { Sequelize } from "sequelize";
import { Admin } from "./admin.js";
import { Banner } from "./banner.js";
import { Category } from "./category.js";
import { Coupon } from "./coupon.js";
import { Footer } from "./footer.js";
import { NavbarOption } from "./navbarOption.js";
import { Order } from "./order.js";
import { OrderItem } from "./orderItem.js";
import { Product } from "./product.js";
import { Review } from "./review.js";
import { Store } from "./store.js";
import { Policy } from "./policy.js";
import { User } from "./user.js";
import { Variant } from "./variant.js";
import { initAdminModel } from "./admin.js";
import { initBannerModel } from "./banner.js";
import { initCategoryModel } from "./category.js";
import { initCouponModel } from "./coupon.js";
import { initFooterModel } from "./footer.js";
import { initNavbarOptionModel } from "./navbarOption.js";
import { initOrderItemModel } from "./orderItem.js";
import { initOrderModel } from "./order.js";
import { initProductModel } from "./product.js";
import { initReviewModel } from "./review.js";
import { initStoreModel } from "./store.js";
import { initPolicyModel } from "./policy.js";
import { initUserModel } from "./user.js";
import { initVariantModel } from "./variant.js";
import { SocialLink } from "./socialLink.js";

const initModels = (sequelize: Sequelize) => {
  initStoreModel(sequelize);
  initAdminModel(sequelize);
  initUserModel(sequelize);
  initCategoryModel(sequelize);
  initProductModel(sequelize);
  initVariantModel(sequelize);
  initOrderModel(sequelize);
  initOrderItemModel(sequelize);
  initNavbarOptionModel(sequelize);
  initFooterModel(sequelize);
  initBannerModel(sequelize);
  initPolicyModel(sequelize);
  initReviewModel(sequelize);
  initCouponModel(sequelize);

  Store.hasMany(Admin, { foreignKey: "storeId", as: "admins" });
  Admin.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(User, { foreignKey: "storeId", as: "users" });
  User.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(Category, { foreignKey: "storeId", as: "categories" });
  Category.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(Product, { foreignKey: "storeId", as: "products" });
  Product.belongsTo(Store, { foreignKey: "storeId", as: "store" });
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  Product.hasMany(Variant, { foreignKey: "productId", as: "variants" });
  Variant.belongsTo(Product, { foreignKey: "productId", as: "product" });

  Store.hasMany(Order, { foreignKey: "storeId", as: "orders" });
  Order.belongsTo(Store, { foreignKey: "storeId", as: "store" });
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });

  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
  Variant.hasMany(OrderItem, { foreignKey: "variantId", as: "orderItems" });
  OrderItem.belongsTo(Variant, { foreignKey: "variantId", as: "variant" });

  OrderItem.hasOne(Review, { foreignKey: "orderItemId", as: "review" });
  Review.belongsTo(OrderItem, { foreignKey: "orderItemId", as: "orderItem" });

  Store.hasMany(NavbarOption, { foreignKey: "storeId", as: "navbarOptions" });
  NavbarOption.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(Footer, { foreignKey: "storeId", as: "footers" });
  Footer.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(Banner, { foreignKey: "storeId", as: "banners" });
  Banner.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(Policy, { foreignKey: "storeId", as: "policies" });
  Policy.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasMany(Review, { foreignKey: "storeId", as: "reviews" });
  Review.belongsTo(Store, { foreignKey: "storeId", as: "store" });
  Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
  Review.belongsTo(Product, { foreignKey: "productId", as: "product" });
  User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
  Review.belongsTo(User, { foreignKey: "userId", as: "user" });

  Store.hasMany(Coupon, { foreignKey: "storeId", as: "coupons" });
  Coupon.belongsTo(Store, { foreignKey: "storeId", as: "store" });

  Store.hasOne(SocialLink, { foreignKey: "storeId", as: "socialLinks" });
  SocialLink.belongsTo(Store, { foreignKey: "storeId", as: "store" });

};

export {
  initModels,
  Admin,
  Banner,
  Category,
  Coupon,
  Footer,
  NavbarOption,
  Order,
  OrderItem,
  Product,
  Review,
  SocialLink,
  Store,
  Policy,
  User,
  Variant,
};
