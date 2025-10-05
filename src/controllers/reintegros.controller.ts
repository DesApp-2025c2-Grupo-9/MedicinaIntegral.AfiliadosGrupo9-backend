import { Request, Response } from 'express';
import { IReintegro } from '../interfaces/IReintegro';
import Reintegro from '../models/Reintegro';

export const postReintegro = async (req: Request<{}, {}, IReintegro>, res: Response) => {
  try {
    const nuevoReintegro = await Reintegro.create(req.body);
    res.json({ nuevoReintegro });
  } catch (error) {
    res.status(500).json({ message: `Ha ocurrido un error. ${error}` });
  }
};
