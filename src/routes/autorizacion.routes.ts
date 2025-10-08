import { Router } from 'express';
import autorizacionController from '../controllers/autorizacion.controller'

const autorizacionesRoutes = Router();

autorizacionesRoutes.route('/autorizaciones')
    .get(autorizacionController.getAllAutorizaciones)
    .post(autorizacionController.createAutorizacion);

autorizacionesRoutes.route('/autorizaciones/:id')
    .put(autorizacionController.updateAutorizacion)
    .delete(autorizacionController.deleteAutorizacion);

export default autorizacionesRoutes; 
