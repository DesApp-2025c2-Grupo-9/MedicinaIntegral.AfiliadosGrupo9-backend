import { Router } from 'express';
import reintegroController from '../controllers/reintegros.controller';
import { filtroAfiliadoActual } from '../middlewares/filtroAfiliadoActual';

const router = Router();

router.get('/reintegros/:idAfiliado', filtroAfiliadoActual, reintegroController.getAllReintegros);
router.post('/reintegros', reintegroController.createReintegro);
router.put('/reintegros/:id', reintegroController.updateReintegro);
router.patch('/reintegros/:id', reintegroController.deleteReintegro);
router.post('/reintegros/:id', reintegroController.commentReintegroById);

export default router;
