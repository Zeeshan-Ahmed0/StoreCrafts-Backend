import { Router } from "express";
import { adminRouter } from "./admin.js";
import { authRouter } from "./auth.js";
import { bannerRouter } from "./banner.js";
import { categoryRouter } from "./category.js";
import { couponRouter } from "./coupon.js";
import { footerRouter } from "./footer.js";
import { healthRouter } from "./health.js";
import { navbarRouter } from "./navbar.js";
import { orderRouter } from "./order.js";
import { policyRouter } from "./policy.js";
import { productRouter } from "./product.js";
import { publicRouter } from "./public.js";
import { reviewRouter } from "./review.js";
import { storeRouter } from "./store.js";
import { uploadRouter } from "./uploads.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/banners", bannerRouter);
router.use("/categories", categoryRouter);
router.use("/coupons", couponRouter);
router.use("/footers", footerRouter);
router.use("/orders", orderRouter);
router.use("/navbar", navbarRouter);
router.use("/policies", policyRouter);
router.use("/products", productRouter);
router.use("/reviews", reviewRouter);
router.use("/store", storeRouter);
router.use("/public", publicRouter);
router.use("/uploads", uploadRouter);

export { router };
