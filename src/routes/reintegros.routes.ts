import { Router } from "express";
import reintegroController from "../controllers/reintegros.controller";

const router = Router();

// const repo = reintegrosRepository();
// const service = reintegrosService(repo);
// const controller = reintegrosController(service);
// router.get('/reintegros', controller.getAllReintegros);

router.get('/reintegros', reintegroController.getAllReintegros);
router.post('/reintegros', reintegroController.createReintegro);
router.put('/reintegros/:id', reintegroController.updateReintegro);
router.delete('/reintegros/:id', reintegroController.deleteReintegro);
router.get("/reintegros", reintegroController.getAllReintegros);
router.post("/reintegros", reintegroController.createReintegro);

export default router;
