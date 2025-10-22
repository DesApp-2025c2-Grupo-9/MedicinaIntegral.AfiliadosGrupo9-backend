import { Router } from "express";
import { getEspecialidadesConLocalidades } from "../controllers/newPrestadors.controller";

const router = Router();

//Dada una especialidad, obtener una lista de localidades en la que atienenden con esa especialidad
router.get('/prestadores/especialidades/localidades',getEspecialidadesConLocalidades)

//Dada una especialidad Y una localidad, obtener los profesionales



export default router;