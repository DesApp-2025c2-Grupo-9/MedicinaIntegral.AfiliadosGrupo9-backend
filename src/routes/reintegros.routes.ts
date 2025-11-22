import { Router } from 'express';
import reintegroController from '../controllers/reintegros.controller';
import { filtroAfiliadoActual } from '../middlewares/filtroAfiliadoActual';
import { existsModelById, validarCamposExactos, validarQueryExactos } from '../middlewares/genericMiddleware';
import Afiliado from '../models/Afiliado';
import Reintegro from '../models/Reintegro';

const router = Router();

/* router.get('/reintegros/:idAfiliado', existsModelById(Afiliado, 'idAfiliado'), filtroAfiliadoActual, reintegroController.getAllReintegros);
router.post('/reintegros', validarCamposExactos(Reintegro), reintegroController.createReintegro);
router.put('/reintegros/:id', existsModelById(Reintegro), validarQueryExactos(Reintegro), reintegroController.updateReintegro);
router.patch('/reintegros/:id', existsModelById(Reintegro), reintegroController.deleteReintegro);
router.post('/reintegros/:id', existsModelById(Reintegro), reintegroController.commentReintegroById); */
router.get('/reintegros/:idAfiliado', filtroAfiliadoActual, reintegroController.getAllReintegros);
router.post('/reintegros', reintegroController.createReintegro);
router.put('/reintegros/:id', reintegroController.updateReintegro);
router.patch('/reintegros/:id', reintegroController.deleteReintegro);
router.post('/reintegros/:id', reintegroController.commentReintegroById);

export default router;
