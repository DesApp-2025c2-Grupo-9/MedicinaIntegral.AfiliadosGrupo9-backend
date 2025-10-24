import { Request, Response } from 'express';
import IReintegro from '../interfaces/IReintegro';
import Reintegro from '../models/Reintegro';
import { SUCCESS_MESSAGES } from '../utils/successMessages';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { CommentReintegroDTO, DeleteReintegroDTO, GetReintegrosDTO, PostReintegroDTO, PutReintegroDTO } from '../dtos/reintegros.dto';
import { ApiResponse } from '../types/ApiResponse';
import { IObservacion } from '../interfaces/IObservacion';

type UpdatedReintegro = Omit<IReintegro, 'observaciones'> & {
  observaciones: string;
};

interface IReintegroController {
  getAllReintegros: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  createReintegro: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  updateReintegro: (req: Request<{ id: number }, {}, Partial<UpdatedReintegro>>, res: Response<ApiResponse>) => Promise<void>;
  deleteReintegro: (req: Request<{ id: number }>, res: Response<ApiResponse>) => Promise<void>;
  commentReintegroById: (req: Request<{ id: number }, {}, { comentario: string }>, res: Response<ApiResponse>) => Promise<void>;
}

const reintegroController: IReintegroController = {
  getAllReintegros: async (req, res) => {
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const reintegros = await Reintegro.find({ $and: [{ fechaBaja: { $exists: false } }, { idAfiliado: { $in: idsAfiliados } }] });
      const reintegrosDTO = reintegros.map(reintegro => new GetReintegrosDTO(reintegro));
      res.json({ data: reintegrosDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  createReintegro: async (req, res) => {
    const idAfiliado = req.familiaresPermitidos?.[0]; // El primer id corresponde a quien hizo la petición
    const observacion: IObservacion = {
      // construimos la observación con el comentario que envió el afiliado
      idEmisor: idAfiliado!,
      rolEmisor: 'Afiliado',
      descripcion: req.body.observaciones,
      fecha: new Date()
    };
    const reintegroBody = {
      ...req.body,
      idAfiliado,
      observaciones: [observacion]
    };

    try {
      const newReintegro = await Reintegro.create(reintegroBody);
      const newReintegroDTO = new PostReintegroDTO(newReintegro);
      res.json({ data: newReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.CREATED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  updateReintegro: async (req, res) => {
    const { id } = req.params;
    const descripcionObservacion = req.body.observaciones || '';

    try {
      const unReintegro = await Reintegro.findById(id);
      if (!unReintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }

      const updatedObservacion: IObservacion = { // Esta es una única observación
        ...unReintegro.observaciones[0],
        descripcion: descripcionObservacion
      };
      const reintegroBody = {
        ...unReintegro,
        observaciones: [updatedObservacion]
      };

      Object.assign(unReintegro, reintegroBody);
      const updatedReintegro = await unReintegro.save();
      const updatedReintegroDTO = new PutReintegroDTO(updatedReintegro);
      res.json({ data: updatedReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.UPDATED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  deleteReintegro: async (req, res) => {
    const { id } = req.params;

    try {
      const reintegro = await Reintegro.findById(id);
      if (!reintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }
      reintegro.fechaBaja = new Date();
      await reintegro.save();

      const deletedReintegroDTO = new DeleteReintegroDTO(reintegro);
      res.json({ data: deletedReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.DELETED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  commentReintegroById: async (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;
    const idAfiliado = req.familiaresPermitidos?.[0];

    const observacion: IObservacion = {
      idEmisor: idAfiliado!,
      rolEmisor: 'Afiliado',
      descripcion: comentario,
      fecha: new Date()
    };

    try {
      const unReintegro = await Reintegro.findById(id);
      if (!unReintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }
      unReintegro.observaciones = [...unReintegro.observaciones, observacion];
      const commentedReintegro = await unReintegro.save();
      const commentedReintegroDTO = new CommentReintegroDTO(commentedReintegro);
      res.json({ data: commentedReintegroDTO, message: SUCCESS_MESSAGES.REINTEGRO.COMMENTED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
};

export default reintegroController;
