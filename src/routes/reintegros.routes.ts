import { Router } from "express";
import reintegroController from "../controllers/reintegros.controller";

const router = Router();

router.get("/reintegros", reintegroController.getAllReintegros);
router.post("/reintegros", reintegroController.createReintegro);

export default router;
