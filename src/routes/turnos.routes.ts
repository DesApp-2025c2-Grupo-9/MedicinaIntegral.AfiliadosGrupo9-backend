import { Router } from "express";
import { getTurnosFiltrados } from "../controllers/turnos.controller";

const router = Router();

//Dada una Especialidad Y una localidad Y un profesional||todos, obtener Turnos disponibles
router.get('/turnos',getTurnosFiltrados());

//Reservar un turno

//Anular la reserva de un turno


export default router;