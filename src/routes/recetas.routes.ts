import { Router } from "express";
import recetaController from "../controllers/recetas.controller";

const router = Router();

router.get("/recetas", recetaController.getAllRecetas);
router.get(
  "/recetas/grupo-familiar",
  recetaController.getRecetasByGrupoFamiliar
);

router.post("/recetas", recetaController.createReceta);
router.put("/recetas/:id", recetaController.updateReceta);
router.patch("/recetas/:id", recetaController.patchReceta);
router.delete("/recetas/:id", recetaController.deleteReceta);
router.delete("/recetas/soft/:id", recetaController.deleteSoftReceta);
export default router;
