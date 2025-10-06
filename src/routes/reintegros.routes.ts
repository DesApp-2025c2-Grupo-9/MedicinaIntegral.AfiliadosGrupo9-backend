import { Router } from 'express';
import reintegroController from '../controllers/reintegro.controller';

const router = Router();

router.post('/reintegros', reintegroController.createReintegro);

export default router;
