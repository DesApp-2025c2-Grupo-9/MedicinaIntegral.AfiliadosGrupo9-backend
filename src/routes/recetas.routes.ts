import { Router } from "express";
import recetaController from "../controllers/recetas.controller";

const router = Router();

router.get("/recetas", recetaController.getAllRecetas);
router.post("/recetas", recetaController.createReceta);
router.put("/recetas/:id", recetaController.updateReceta);

//router.patch("/recetas/:id", recetaController.deleteReceta);

//router.patch("/recetas/:id", recetaController.patchReceta);
router.patch("/recetas/delete/:id", recetaController.deleteReceta);

export default router;
