import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError";

// Centralized error handling middleware
function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle AppError (known business errors)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({message: "Validation error", issues: error.format()});
    return;
  }

  // Handle PostgreSQL unique constraint violation (duplicate CNPJ)
  if ((error as any)?.code === "23505") {
    res.status(409).json({ error: "CNPJ já cadastrado" });
    return;
  }

  // Unknown errors
  console.error("Internal server error:", error);
  res.status(500).json({ error: "Erro interno do servidor" });
}

export default errorHandler;
