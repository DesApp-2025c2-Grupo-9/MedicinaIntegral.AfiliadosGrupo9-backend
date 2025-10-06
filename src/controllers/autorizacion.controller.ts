import  Autorizacion  from "../models/Autorizacion";
import { Request, Response } from "express";
import { IAutorizacion } from '../interfaces/IAutorizacion';
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from './../utils/errorMessages';

interface Params {
    id: string    
}

interface ResBody {
    message?: string,
    data?: object
}

export const obtenerAutorizaciones = async (req: Request<{}, {}, {}, {}>, res: Response<ResBody>) : Promise<Response> => {
    try {
        const autorizaciones = await Autorizacion.find()
        // .populate('nroAfiliado', 'nombre apellido');
        return res.status(200).json({ data: autorizaciones });
    } catch(error) {
        const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
        return res.status(500).json({ message });
    }
}

export const crearAutorizacion = async (req: Request<{}, {}, IAutorizacion, {}>, res: Response<ResBody> ) : Promise<Response> => {
    try {
        const nuevaAutorizacion = await Autorizacion.create({...req.body});
        return res.status(200).json({ data: nuevaAutorizacion, message: SUCCESS_MESSAGES.AUTORIZACION.CREATED });
    } catch(error) {
        const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
        return res.status(500).json({ message });
    }
}

export const modificarAutorizacion = async (req: Request<Params, {}, IAutorizacion, {}>, res: Response<ResBody> ) : Promise<Response> => {
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
}

export const eliminarAutorizacion = async (req: Request<Params, {}, {}, {}>, res: Response<ResBody> ) : Promise<Response> => {
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