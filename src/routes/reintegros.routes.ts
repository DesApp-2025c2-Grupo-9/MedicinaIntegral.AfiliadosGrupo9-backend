import { Router } from 'express';
import { postReintegro } from '../controllers/reintegros.controller';

const router = Router();

router.post('/reintegros', postReintegro);

export default router;
