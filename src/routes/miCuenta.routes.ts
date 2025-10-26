
import { Router } from 'express';
import { MiCuentaController } from '../controllers/miCuenta.controller';

const router = Router();


router.get('/mi-cuenta', MiCuentaController.obtenerMiCuenta);
router.post('/mi-cuenta/cbu', MiCuentaController.registrarCBU);

export default router;