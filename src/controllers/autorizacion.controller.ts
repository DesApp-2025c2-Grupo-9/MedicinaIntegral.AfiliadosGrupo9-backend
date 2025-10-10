import { Request, Response } from "express";
import  Autorizacion  from "../models/Autorizacion";
import { IAutorizacion } from '../interfaces/IAutorizacion';
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { GetAutorizacionesDTO, IdAutorizacionDTO } from "../dtos/autorizaciones.dto";
import { ApiResponse } from '../types/ApiResponse';

interface IAutorizacionController {
    getAllAutorizaciones: (req: Request, res: Response<ApiResponse>) => Promise<void>;
    createAutorizacion: (req: Request<{}, {}, IAutorizacion>, res: Response<ApiResponse>) => Promise<void>;
    updateAutorizacion: (req: Request<{id: string}, {}, Omit<IAutorizacion, 'id'>>, res: Response<ApiResponse>) => Promise<void>;
    deleteAutorizacion: (req: Request<{id: string}>, res: Response<ApiResponse>) => Promise<void>;
}

const autorizacionController: IAutorizacionController = {
    getAllAutorizaciones : async (req, res) => {
        try {
            const autorizaciones = await Autorizacion.find()
            const autorizacionesDTO = autorizaciones.map(a => new GetAutorizacionesDTO(a))
            res.status(200).json({ data: autorizacionesDTO });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
           res.status(500).json({ message });
        }
    },
    createAutorizacion : async (req, res) => {
        try {
            const nuevaAutorizacion = await Autorizacion.create(req.body);
            res.status(200).json({ data: new IdAutorizacionDTO(nuevaAutorizacion), message: SUCCESS_MESSAGES.AUTORIZACION.CREATED });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            res.status(500).json({ message });
        }
    },
    updateAutorizacion : async (req, res) => {
        try {
          const { id } = req.params;
          const autorizacionActualizada = await Autorizacion.findByIdAndUpdate(id, req.body, { new: true });

          if (!autorizacionActualizada) {
            res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND });
            return;
          }

          res.status(200).json({ data: new IdAutorizacionDTO(autorizacionActualizada), message: SUCCESS_MESSAGES.AUTORIZACION.UPDATED });
        } catch(error) {
          const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
          res.status(500).json({ message });
        }
    },
    deleteAutorizacion : async (req, res) => {
        try {
            const { id } = req.params;
            const autorizacionEliminada = await Autorizacion.findByIdAndDelete(id);

            if (!autorizacionEliminada) {
                res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND });
                return;
            }

            res.status(200).json({ data: new IdAutorizacionDTO(autorizacionEliminada), message: SUCCESS_MESSAGES.AUTORIZACION.DELETED });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            res.status(500).json({ message });
        }
    }
};

export default autorizacionController;

