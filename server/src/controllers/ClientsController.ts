import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db";
import { clientes } from "../db/schema";
import AppError from "../utils/AppError";
import { clienteCreateSchema, clienteUpdateSchema } from "../validation/cliente";

class ClientesController {
  // GET /api/clientes - List all clients
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await db.select().from(clientes);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/clientes - Create a new client
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const body = clienteCreateSchema.parse(request.body);
      const [newCliente] = await db
        .insert(clientes)
        .values(body)
        .returning();

      return response.status(201).json(newCliente);
      
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/clientes/:id - Update an existing client
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "ID deve ser um número" })
        .parse(request.params.id);

      const body = clienteUpdateSchema.parse(request.body);

      const [updated] = await db
        .update(clientes)
        .set(body)
        .where(eq(clientes.id, id))
        .returning();

      if (!updated) {
        throw new AppError("Cliente não encontrado", 404);
      }

      return response.json(updated);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/clientes/:id - Delete a client
  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "ID deve ser um número" })
        .parse(request.params.id);

      const [deleted] = await db
        .delete(clientes)
        .where(eq(clientes.id, id))
        .returning();

      if (!deleted) {
        throw new AppError("Cliente não encontrado", 404);
      }

      return response.json({ message: "Cliente excluído com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

export default ClientesController;
