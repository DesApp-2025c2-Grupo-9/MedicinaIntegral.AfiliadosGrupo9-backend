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
import Afiliado from "../models/Afiliado";

const router = Router();

router.use(logRequest);

router.get(
  "/recetas/:idAfiliado",
  //MIddlewares
  existsModelById(Afiliado, 'idAfiliado'),
  filtroAfiliadoActual,
  recetaController.getAllRecetas
);
router.post(
  "/recetas",
  //Middlewares
  validarCamposExactos(Receta),
  recetaController.createReceta
);
router.put(
  "/recetas/:id",
  //Middlewares
  existsModelById(Receta),
  validarCamposExactos(Receta),
  recetaController.updateReceta
);
router.patch(
  "/recetas/:id",
  //MIddlewares
  existsModelById(Receta),
  recetaController.deleteReceta
);
router.post(
  "/recetas/:id", 
  existsModelById(Receta),
  recetaController.commentRecetaById);

router.get(
  '/receta/:id',
  existsModelById(Receta),
  recetaController.getRecetaById
)

export default router;
