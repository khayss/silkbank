import { NextFunction, Request, Response } from "express";

export const catchError =
  (controller: (req: Request, res: Response) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      next(error);
    }
  };
