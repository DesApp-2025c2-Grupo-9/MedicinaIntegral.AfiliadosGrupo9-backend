import { Router } from "express";
import { getEspecialidadesConLocalidadesYMedicos } from "../controllers/newPrestadors.controller";

const router = Router();

//Dada una especialidad, obtener una lista de localidades en la que atienenden con esa especialidad
router.get('/prestadores/especialidades/localidades/medicos',getEspecialidadesConLocalidadesYMedicos)

//Dada una especialidad Y una localidad, obtener los profesionales



export default router;