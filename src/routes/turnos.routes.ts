import { Router } from "express";
import { turnosFiltrados,
    especialidadesDisponibles,
    localidadesPorEspecialidad,
    prestadoresPorEspecialidadYLocalidad,
    reservarTurno,
    turnosPorAfiliado,
    cancelarTurno
} from "../controllers/turnos.controller";

const router = Router();


router.get('/especialidades', especialidadesDisponibles);

router.get('/localidades', localidadesPorEspecialidad);

router.get('/prestadores', prestadoresPorEspecialidadYLocalidad);

router.get('/filtrados', turnosFiltrados)

router.patch('/reservarTurno', reservarTurno)

router.get('/turnosPorAfiliado', turnosPorAfiliado)

router.patch('/cancelarTurno', cancelarTurno)


export default router;