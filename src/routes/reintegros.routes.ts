import { Router } from 'express';
import reintegroController from '../controllers/reintegros.controller';

// import reintegrosRepository from '../temp/repositories/reintegros.repository';
// import reintegrosService from '../temp/services/reintegros.service';
// import reintegrosController from '../controllers/reintegros.controller';

const router = Router();

// const repo = reintegrosRepository();
// const service = reintegrosService(repo);
// const controller = reintegrosController(service);
// router.get('/reintegros', controller.getAllReintegros);

router.get('/reintegros', reintegroController.getAllReintegros);
router.post('/reintegros', reintegroController.createReintegro);
router.put('/reintegros/:id', reintegroController.updateReintegro);
router.delete('/reintegros/:id', reintegroController.deleteReintegro);

export default router;
