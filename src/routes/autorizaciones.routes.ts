import { Router } from 'express';
import autorizacionController from '../controllers/autorizacion.controller';
import Autorizacion from '../models/Autorizacion';
import {
  logRequest,
  existsModelById,
  existsAnyByModel,
  validarCamposExactos,
} from '../middlewares/genericMiddleware';
import { filtroAfiliadoActual } from '../middlewares/filtroAfiliadoActual';

const router = Router();


router.use(logRequest);

router
  .route('/autorizaciones/:idAfiliado')
  .get(
    filtroAfiliadoActual,
    existsAnyByModel(Autorizacion),//Middleware genérico
    autorizacionController.getAllAutorizaciones
)
  .post(
    validarCamposExactos(Autorizacion),
    autorizacionController.createAutorizacion);

router
  .route('/autorizaciones/:id')
  .put(
    existsModelById(Autorizacion),//Middelware genérico
    autorizacionController.updateAutorizacion
    )
  .patch(
    existsModelById(Autorizacion),//Middelware genérico
    autorizacionController.deleteAutorizacion);

export default router;
