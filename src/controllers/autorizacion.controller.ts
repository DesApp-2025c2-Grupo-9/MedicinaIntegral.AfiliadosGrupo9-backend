import  Autorizacion  from "../models/Autorizacion";
import { Request, Response } from "express";
import { IAutorizacion } from '../interfaces/IAutorizacion';
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from './../utils/errorMessages';

interface ResBody {
    message?: string,
    data?: object
}

interface IAutorizacionController {
    getAllAutorizaciones: (req: Request, res: Response<ResBody>) => Promise<Response>;
    createAutorizacion: (req: Request<{}, {}, IAutorizacion>, res: Response<ResBody>) => Promise<Response>;
    updateAutorizacion: (req: Request<{id: string}, {}, IAutorizacion>, res: Response<ResBody>) => Promise<Response>;
    deleteAutorizacion: (req: Request<{id: string}>, res: Response<ResBody>) => Promise<Response>;
}


const autorizacionController: IAutorizacionController = {
    getAllAutorizaciones : async (req, res) => {
        try {
            const autorizaciones = await Autorizacion.find()
            return res.status(200).json({ data: autorizaciones });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            return res.status(500).json({ message });
        }
    },
    createAutorizacion : async (req, res) => {
        try {
            const nuevaAutorizacion = await Autorizacion.create(req.body);
            return res.status(200).json({ data: nuevaAutorizacion, message: SUCCESS_MESSAGES.AUTORIZACION.CREATED });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            return res.status(500).json({ message });
        }
    },
    updateAutorizacion : async (req, res) => {
        try {
          const { id } = req.params;
          const autorizacionActualizada = await Autorizacion.findByIdAndUpdate(id, req.body, { new: true });

          if (!autorizacionActualizada) {
            return res.status(404).json({ message: "Autorización no encontrada" });
          }

          return res.status(200).json({ data: autorizacionActualizada, message: SUCCESS_MESSAGES.AUTORIZACION.UPDATED });
        } catch(error) {
          const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
          return res.status(500).json({ message });
        }
    },
    deleteAutorizacion : async (req, res) => {
        try {
            const { id } = req.params;
            const autorizacionEliminada = await Autorizacion.findByIdAndDelete(id);

            if (!autorizacionEliminada) {
                return res.status(404).json({ message: "Autorización no encontrada" });
            }

            return res.status(200).json({ data: autorizacionEliminada, message: SUCCESS_MESSAGES.AUTORIZACION.DELETED });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            return res.status(500).json({ message });
        }   
    }
};

export default autorizacionController;

