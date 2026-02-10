import { Router } from "express";
import ClientesController from "../controllers/ClientsController";

const router = Router();
const clientesController = new ClientesController();

// GET /api/clientes - List all clients
router.get("/", clientesController.index);

// POST /api/clientes - Create a new client
router.post("/", clientesController.create);

// PUT /api/clientes/:id - Update an existing client
router.put("/:id", clientesController.update);

// DELETE /api/clientes/:id - Delete a client
router.delete("/:id", clientesController.delete);

export default router;
