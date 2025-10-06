import { Router } from 'express';
import { obtenerAutorizaciones, crearAutorizacion, modificarAutorizacion, eliminarAutorizacion } from '../controllers/autorizacion.controller'

const autorizacionesRoutes = Router();

autorizacionesRoutes.route('/')
    .get(obtenerAutorizaciones)
    .post(crearAutorizacion);

autorizacionesRoutes.route('/:id')
    .put(modificarAutorizacion)
    .delete(eliminarAutorizacion);

export default autorizacionesRoutes; 