import { Request, Response } from "express";
import { IReceta } from "../interfaces/IReceta";
import Receta from "../models/Receta";
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";

type ApiResponse = {
  message?: string;
  data?: object;
};

interface IRecetaController {
  getAllRecetas: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  createReceta: (
    req: Request<{}, {}, IReceta>,
    res: Response<ApiResponse>
  ) => Promise<void>;
}

const recetaController: IRecetaController = {
  getAllRecetas: async (req, res) => {
    console.log("Entré a getAllRecetas");
    try {
      const recetas = await Receta.find({});
      console.log("Recetas encontradas:", recetas);
      res.status(200).json({ data: recetas });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  createReceta: async (req, res) => {
    try {
      const newReceta = await Receta.create(req.body);
      res.status(201).json({
        message: SUCCESS_MESSAGES.RECETA.CREATED,
        data: newReceta,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
};

export default recetaController;
