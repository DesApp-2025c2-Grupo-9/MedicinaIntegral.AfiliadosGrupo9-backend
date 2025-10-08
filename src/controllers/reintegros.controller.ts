import { Request, Response } from 'express';
import IReintegro from '../interfaces/IReintegro';
import Reintegro from '../models/Reintegro';
import { SUCCESS_MESSAGES } from '../utils/successMessages';
import { ERROR_MESSAGES } from '../utils/errorMessages';

type ApiResponse = {
  message?: string;
  data?: object;
};

interface IReintegroController {
  getAllReintegros: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  createReintegro: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  updateReintegro: (req: Request<{ id: number }, {}, Partial<IReintegro>>, res: Response<ApiResponse>) => Promise<void>;
  deleteReintegro: (req: Request<{ id: number }>, res: Response<ApiResponse>) => Promise<void>;
}

const reintegroController: IReintegroController = {
  getAllReintegros: async (req, res) => {
    try {
      const reintegros = await Reintegro.find({});
      res.json({ data: reintegros });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  createReintegro: async (req, res) => {
    try {
      const newReintegro = await Reintegro.create(req.body);
      res.json({ data: newReintegro, message: SUCCESS_MESSAGES.REINTEGRO.CREATED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  updateReintegro: async (req, res) => {
    const { id } = req.params;

    try {
      const reintegro = await Reintegro.findById(id);
      if (!reintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }
      Object.assign(reintegro, req.body);
      const updatedReintegro = await reintegro.save();
      res.json({ data: updatedReintegro, message: SUCCESS_MESSAGES.REINTEGRO.UPDATED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  deleteReintegro: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedReintegro = await Reintegro.findByIdAndDelete(id);
      if (!deletedReintegro) {
        res.status(404).json({ message: ERROR_MESSAGES.REINTEGRO.NOT_FOUND });
        return;
      }
      res.json({ data: deletedReintegro, message: SUCCESS_MESSAGES.REINTEGRO.DELETED });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
};

/* export default function (reintegroService: IReintegroService): IReintegroController {
  return {
    getAllReintegros: async (req, res) => {
      try {
        const reintegrosDTO = await reintegroService.getAllReintegros();
        res.json({ data: reintegrosDTO });
      } catch (error) {
        const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
        res.status(500).json({ message });
      }
    },
    createReintegro: async (req, res) => {
      try {
        const newReintegro = await Reintegro.create(req.body);
        res.json({ data: newReintegro, message: SUCCESS_MESSAGES.REINTEGRO.CREATED });
      } catch (error) {
        const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
        res.status(500).json({ message });
      }
    }
  };
} */
export default reintegroController;
