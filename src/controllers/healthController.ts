import type { Request, Response } from "express";

const getHealth = (req: Request, res: Response) => {
  res.json({
    status: "ok",
    storeId: req.storeId ?? null,
    timestamp: new Date().toISOString(),
  });
};

export { getHealth };
