import { NextFunction, Request, Response } from "express";

export const catchError =
  (controller: (req: Request, res: Response, next: NextFunction) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
