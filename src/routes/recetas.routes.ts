import { Router } from "express";
import recetaController from "../controllers/recetas.controller";
import Receta from "../models/Receta";
import {
  logRequest,
  existsModelById,
  existsAnyByModel,
  validarCamposExactos,
} from "../middlewares/genericMiddleware";
import { filtroAfiliadoActual } from "../middlewares/filtroAfiliadoActual";

const router = Router();

router.use(logRequest);

router.get(
  "/recetas/:idAfiliado",
  filtroAfiliadoActual,
  existsAnyByModel(Receta),
  recetaController.getAllRecetas
);
router.post(
  "/recetas",
  validarCamposExactos(Receta),
  recetaController.createReceta
);
router.put(
  "/recetas/:id",
  existsModelById(Receta),
  recetaController.updateReceta
);
router.patch(
  "/recetas/:id",
  existsModelById(Receta),
  recetaController.deleteReceta
);
router.post("/recetas/:id", recetaController.commentRecetaById);

export default router;
