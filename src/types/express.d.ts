import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    storeId?: string;
    auth?: {
      adminId: string;
      role: "super_admin" | "store_admin" | "store_owner";
      storeId: string | null;
    };
  }
}
