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
  createReintegro: (req: Request<{}, {}, IReintegro>, res: Response<ApiResponse>) => Promise<void>;
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
  }
};

export default reintegroController;
