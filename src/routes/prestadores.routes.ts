import { Router } from "express";
import prestadorController from "../controllers/prestador.controller";

const router = Router();

router.get("/prestadores", prestadorController.getPrestadores);

export default router;
