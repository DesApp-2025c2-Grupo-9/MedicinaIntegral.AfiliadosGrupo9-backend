import { Router } from 'express';
import { miCuentaController } from '../controllers/miCuenta.controller';

const router = Router();

router.get('/mi-cuenta', miCuentaController.getMiCuenta);
<<<<<<< HEAD
router.post('/mi-cuenta/cbu', miCuentaController.registrarCbu);
router.put('/mi-cuenta/cbu', miCuentaController.setCbuPrincipal);
router.put('/mi-cuenta/cbu-principal/:cbu', miCuentaController.editarCbu);
//router.delete('/mi-cuenta/cbu-principal/:cbu', miCuentaController.eliminarCbu);


=======
router.post('/mi-cuenta/cbu', miCuentaController.registerCbu);
router.put('/mi-cuenta/cbu', miCuentaController.setMainCbu);
>>>>>>> 0c81c77b4b12637c1dd7fc679fb5d0d06fb41492

export default router;
