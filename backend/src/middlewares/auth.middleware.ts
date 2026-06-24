import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new AppError("Token não fornecido", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError("Token inválido ou expirado", 401));
  }
};

export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) return next(new AppError("Não autenticado", 401));
  if (req.user.role !== "admin")
    return next(new AppError("Acesso negado", 403));
  next();
};
