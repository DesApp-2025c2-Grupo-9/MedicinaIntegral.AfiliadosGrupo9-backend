import { Router } from 'express';
import { miCuentaController } from '../controllers/miCuenta.controller';

const router = Router();

router.get('/mi-cuenta', miCuentaController.getMiCuenta);
router.post('/mi-cuenta/cbu', miCuentaController.registerCbu);
router.put('/mi-cuenta/cbu', miCuentaController.setMainCbu);

export default router;
