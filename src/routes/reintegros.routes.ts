import { Router } from "express";
import reintegroController from "../controllers/reintegros.controller";

const router = Router();

router.get("/", reintegroController.getAllReintegros);
router.post("/", reintegroController.createReintegro);

export default router;
