import { Router } from 'express';
import reintegroController from '../controllers/reintegros.controller';
import { filtroAfiliadoActual } from '../middlewares/filtroAfiliadoActual';
import { existsModelById, validarCamposExactos, validarQueryExactos } from '../middlewares/genericMiddleware';
import Afiliado from '../models/Afiliado';
import Reintegro from '../models/Reintegro';

const router = Router();

router.get(
    '/reintegros/:idAfiliado',
    //Middleware
    existsModelById(Afiliado, 'idAfiliado'),
    filtroAfiliadoActual,
    reintegroController.getAllReintegros);
router.post(
    '/reintegros', 
    //Middleware
    validarCamposExactos(Reintegro),
    reintegroController.createReintegro);
router.put(
    '/reintegros/:id', 
    //Middelware
    existsModelById(Reintegro),
    validarQueryExactos(Reintegro),
    reintegroController.updateReintegro);
router.patch(
    '/reintegros/:id', 
    //Middleware
    existsModelById(Reintegro),
    reintegroController.deleteReintegro);
router.post(
    '/reintegros/:id', 
    //Middelware
    existsModelById(Reintegro),
    reintegroController.commentReintegroById);

export default router;
