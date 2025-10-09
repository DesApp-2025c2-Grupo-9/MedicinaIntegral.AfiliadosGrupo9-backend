import { Router } from 'express';
import autorizacionController from '../controllers/autorizacion.controller'

const router = Router();

router.route('/autorizaciones')
    .get(autorizacionController.getAllAutorizaciones)
    .post(autorizacionController.createAutorizacion);

router.route('/autorizaciones/:id')
    .put(autorizacionController.updateAutorizacion)
    .delete(autorizacionController.deleteAutorizacion);

export default router;
