import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { logRequest } from '../middlewares/genericMiddleware';

const router = Router();
router.use(logRequest);

router.get('/dashboard/turnos', 
    dashboardController.getLatestTurnos);

router.get('/dashboard/tramites', 
    dashboardController.getLatestTramites);

export default router;