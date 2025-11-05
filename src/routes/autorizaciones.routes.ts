import { Router } from "express";
import autorizacionController from "../controllers/autorizacion.controller";
import Autorizacion from "../models/Autorizacion";
import {
  logRequest,
  existsModelById,
  validarCamposExactos,
  existModelRequest,
} from "../middlewares/genericMiddleware";
import { filtroAfiliadoActual } from "../middlewares/filtroAfiliadoActual";
import Afiliado from "../models/Afiliado";
import { Prestador } from "../models/Prestador";

const router = Router();

router.use(logRequest);

router.get(
  "/autorizaciones/:idAfiliado",
  //Middleware genérico
  existsModelById(Afiliado, 'idAfiliado'),
  filtroAfiliadoActual,
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
    //Middelware genérico
    existsModelById(Autorizacion), 
    validarCamposExactos(Autorizacion),
    //existModelRequest(Prestador), DESCOMENTAR SI SE PUEDE CAMBIAR DE PRESTADOR
    autorizacionController.updateAutorizacion
  )
  .patch(
    existsModelById(Autorizacion), //Middelware genérico
    autorizacionController.deleteAutorizacion
  )
  .post(
    existsModelById(Autorizacion),
    autorizacionController.commentAutorizacionById);

export default router;
