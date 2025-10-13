import { Router } from 'express';
import autorizacionController from '../controllers/autorizacion.controller';
import Autorizacion from '../models/Autorizacion';
import {
  logRequest,
  existsModelById,
  existsAnyByModel,
  validarCamposExactos,
} from '../middlewares/genericMiddleware';

const router = Router();


router.use(logRequest);

router
  .route('/autorizaciones')
  .get(
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
  .delete(
    existsModelById(Autorizacion),//Middelware genérico
    autorizacionController.deleteAutorizacion);

export default router;
