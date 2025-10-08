import { Router } from "express";
import recetaController from "../controllers/recetas.controller";

const router = Router();

router.get("/", recetaController.getAllRecetas);
router.post("/", recetaController.createReceta);

console.log("Recetas routes cargadas");

export default router;
