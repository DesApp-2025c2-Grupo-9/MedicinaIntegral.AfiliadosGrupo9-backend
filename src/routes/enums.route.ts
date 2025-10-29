import { Router } from "express";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";

const router = Router();

router.get("/especialidades", (_, res) => {
  res.json(Object.values(Especialidad));
});

router.get("/localidades", (_, res) => {
  res.json(Object.values(Localidad));
});

export default router;
