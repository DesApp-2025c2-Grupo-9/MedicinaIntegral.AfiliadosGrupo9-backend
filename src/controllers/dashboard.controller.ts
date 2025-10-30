import { Request, Response } from "express";
import { ApiResponse } from '../types/ApiResponse';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import Turno from "../models/Turno";
import Autorizacion from "../models/Autorizacion";
import Receta from "../models/Receta";
import Reintegro from "../models/Reintegro";
import { GetRecetasDTO } from "../dtos/recetas.dto";
import { GetAutorizacionesDTO } from "../dtos/autorizaciones.dto";
import { GetReintegrosDTO } from "../dtos/reintegros.dto";
import { SUCCESS_MESSAGES } from "../utils/successMessages";

interface IDashboardController {
    getLatestTurnos: (req: Request, res: Response<ApiResponse>) => Promise<void>;
    getLatestTramites: (req: Request, res: Response<ApiResponse>) => Promise<void>;
}

const dashboardController : IDashboardController = {
    getLatestTurnos: async (req, res) => {
        const idsAfiliados = req.familiaresPermitidos;
        try {
            const turnos = await Turno.find({ $and:[{fechaBaja: {$exists: false}} , {idAfiliado: { $in: idsAfiliados }} ]}).sort('fechaTurno').limit(5);
            if(!turnos.length) {
                res.status(204).json({ message: 'No hay turnos registrados' }); 
                return;
            }
            // const turnosDTO = turnos.map(a => new GetTurnosDTO(a));
            res.status(200).json({ data: turnos });
            } catch(error) {
                const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
                res.status(500).json({ message });
            }
    },

    getLatestTramites: async (req, res) => {
        const idsAfiliados = req.familiaresPermitidos;
        const condicionTramite = { $and:[{fechaBaja: {$exists: false}} , {idAfiliado: { $in: idsAfiliados }} ]}

        try {
            const [ultimasRecetas, ultimaAutorizacion, ultimoReintegro] = await Promise.all([
                Receta.find(condicionTramite).sort('-updatedAt').limit(2),
                Autorizacion.find(condicionTramite).sort('-updatedAt').limit(1),
                Reintegro.find(condicionTramite).sort('-updatedAt').limit(1),
            ]);

            if(!ultimaAutorizacion.length && !ultimasRecetas.length && !ultimoReintegro.length) {
                res.status(204).json({ message: SUCCESS_MESSAGES.TRAMITES.NO_CONTENT});
                return
            }

            const recetasDTO = ultimasRecetas.map(r => new GetRecetasDTO(r));
            const autorizacionDTO = ultimaAutorizacion.map(a => new GetAutorizacionesDTO(a));
            const reintegroDTO = ultimoReintegro.map(r => new GetReintegrosDTO(r));
            res.status(200).json({ data: { recetas: recetasDTO, autorizaciones: autorizacionDTO, reintegros: reintegroDTO } });
            } catch(error) {
                const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
                res.status(500).json({ message });
            }
    }
}

export default dashboardController;