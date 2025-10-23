import { Router } from 'express';
import reintegroController from '../controllers/reintegros.controller';

const router = Router();

router.get('/reintegros', reintegroController.getAllReintegros);
router.post('/reintegros', reintegroController.createReintegro);
router.put('/reintegros/:id', reintegroController.updateReintegro);
router.delete('/reintegros/:id', reintegroController.deleteReintegro);
router.post('/reintegros/:id', reintegroController.commentReintegroById);

export default router;
