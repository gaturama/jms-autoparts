import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({ success: false, message: err.message, data: null });
    return;
  }

  if (err.name === "CastError") {
    res
      .status(400)
      .json({ success: false, message: "ID inválido", data: null });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: env.isDev ? err.message : "Erro interno do servidor",
    data: null,
  });
};
