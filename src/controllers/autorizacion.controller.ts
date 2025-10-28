import { Request, Response } from "express";
import  Autorizacion  from "../models/Autorizacion";
import { IAutorizacion } from '../interfaces/IAutorizacion';
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { GetAutorizacionesDTO, IdAutorizacionDTO } from "../dtos/autorizaciones.dto";
import { ApiResponse } from '../types/ApiResponse';
import { IObservacion } from '../interfaces/IObservacion';

interface IAutorizacionController {
    getAllAutorizaciones: (req: Request, res: Response<ApiResponse>) => Promise<void>;
    createAutorizacion: (req: Request, res: Response<ApiResponse>) => Promise<void>;
    updateAutorizacion: (req: Request<{id: string}, {}, Partial<UpdatedAutorizacion>>, res: Response<ApiResponse>) => Promise<void>;
    deleteAutorizacion: (req: Request<{id: string}>, res: Response<ApiResponse>) => Promise<void>;
}
type UpdatedAutorizacion = Omit<IAutorizacion, 'observaciones'> & {
  observaciones: string;
};


const autorizacionController: IAutorizacionController = {
    getAllAutorizaciones : async (req, res) => {
        const idsAfiliados = req.familiaresPermitidos;
        try {
            const autorizaciones = await Autorizacion.find({ $and:[{fechaBaja: {$exists: false}} , {idAfiliado: { $in: idsAfiliados }} ]});
            if(!autorizaciones) {
                res.status(204).json({ message: 'No hay autorizaciones.' }); 
                return;
            }
            const autorizacionesDTO = autorizaciones.map(a => new GetAutorizacionesDTO(a));
            res.status(200).json({ data: autorizacionesDTO });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
           res.status(500).json({ message });
        }
    },
    createAutorizacion : async (req, res) => {
        const idAfiliado = req.familiaresPermitidos?.[0]; 
        const observacion: IObservacion = {
            idEmisor: idAfiliado!,
            rolEmisor: 'Afiliado',
            descripcion: req.body.observaciones,
            fecha: new Date()
        };
        try {
            const nuevaAutorizacion = await Autorizacion.create({...req.body, idAfiliado, observaciones: [observacion]});
            res.status(200).json({ data: new IdAutorizacionDTO(nuevaAutorizacion), message: SUCCESS_MESSAGES.AUTORIZACION.CREATED });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            res.status(500).json({ message });
        }
    },
    updateAutorizacion : async (req, res) => {
        const descripcionObservacion = req.body.observaciones || '';
        const { id } = req.params;

        try {
          console.log(req.body)
          const autorizacion = await Autorizacion.findById(id);
          if (!autorizacion) { 
            res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND});
            return;
          }

          const updatedObservacion: IObservacion = { // Esta es una única observación
            ...autorizacion?.observaciones[0],
            descripcion: descripcionObservacion,
            rolEmisor: "Afiliado"
          };

          const autorizacionBody = {
            ...req.body,
            observaciones: [updatedObservacion]
          };
          Object.assign(autorizacion, autorizacionBody);
          const autorizacionActualizada = await autorizacion.save();
          res.status(200).json({ data: new IdAutorizacionDTO(autorizacionActualizada), message: SUCCESS_MESSAGES.AUTORIZACION.UPDATED });
        } catch(error) {
          const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
          res.status(500).json({ message });
        }
    },
    deleteAutorizacion : async (req, res) => {
        try {
            const { id } = req.params;
            const autorizacion = await Autorizacion.findById(id);
            if (!autorizacion) {
                res.status(404).json({ message: ERROR_MESSAGES.AUTORIZACION.NOT_FOUND});
                return;
            }
            autorizacion.fechaBaja = new Date();
            await autorizacion.save();

            res.status(200).json({ data: new IdAutorizacionDTO(autorizacion), message: SUCCESS_MESSAGES.AUTORIZACION.DELETED });
        } catch(error) {
            const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error)
            res.status(500).json({ message });
        }
    }
};

export default autorizacionController;


