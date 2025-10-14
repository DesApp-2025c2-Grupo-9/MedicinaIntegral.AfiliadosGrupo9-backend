import { Router } from 'express';
import userController from '../../controllers/auth.controller';

const router = Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/refresh-token', userController.refresh);

export default router;
