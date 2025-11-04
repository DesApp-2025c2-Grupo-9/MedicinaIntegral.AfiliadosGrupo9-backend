import { Router } from "express";
import autorizacionController from "../controllers/autorizacion.controller";
import Autorizacion from "../models/Autorizacion";
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
  "/autorizaciones/:idAfiliado",
  filtroAfiliadoActual,
  existsAnyByModel(Autorizacion), //Middleware genérico
  autorizacionController.getAllAutorizaciones
);

router.post(
  "/autorizaciones",
  validarCamposExactos(Autorizacion),
  autorizacionController.createAutorizacion
);

router
  .route("/autorizaciones/:id")
  .put(
    existsModelById(Autorizacion), //Middelware genérico
    autorizacionController.updateAutorizacion
  )
  .patch(
    existsModelById(Autorizacion), //Middelware genérico
    autorizacionController.deleteAutorizacion
  )
  .post(autorizacionController.commentAutorizacionById);

export default router;
