import { Router } from 'express';
import { miCuentaController } from '../controllers/miCuenta.controller';

const router = Router();

router.get('/mi-cuenta', miCuentaController.getMiCuenta);
router.post('/mi-cuenta/cbu', miCuentaController.registrarCbu);
router.put('/mi-cuenta/cbu', miCuentaController.setCbuPrincipal);
router.put('/mi-cuenta/cbu/:cbu', miCuentaController.editarCbu);




export default router;