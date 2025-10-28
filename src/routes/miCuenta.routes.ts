
import { Router } from 'express';
import { MiCuentaController } from '../controllers/miCuenta.controller';
import { verifyJWT } from '../middlewares/verifyJWT';

const router = Router();


router.get('/mi-cuenta',verifyJWT, MiCuentaController.obtenerMiCuenta);
router.post('/mi-cuenta/cbu', verifyJWT, MiCuentaController.registrarCBU);

export default router;