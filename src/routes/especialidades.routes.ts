import { Router } from 'express';
import { getEspecialidades, getEspecialidadesUnicas } from '../controllers/especialidades.controller';

const router = Router();

router.get('/especialidades', getEspecialidades);
router.get('/newEspecialidades', getEspecialidadesUnicas)

export default router;
