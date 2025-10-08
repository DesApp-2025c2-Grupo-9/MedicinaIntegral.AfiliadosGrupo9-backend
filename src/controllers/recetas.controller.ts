import { Request, Response } from "express";
import { IReceta } from "../interfaces/IReceta";
import Receta from "../models/Receta";
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";

type ApiResponse<T = unknown> = {
  message?: string;
  data?: object;
};

interface IRecetaController {
  getAllRecetas(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<Response<ApiResponse>>;

  getRecetaById(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ): Promise<Response<ApiResponse>>;

  createReceta(
    req: Request<{}, {}, IReceta>,
    res: Response<ApiResponse>
  ): Promise<Response<ApiResponse>>;

  updateReceta(
    req: Request<{ id: string }, {}, Partial<IReceta>>,
    res: Response<ApiResponse>
  ): Promise<Response<ApiResponse>>;

  patchReceta(
    req: Request<{ id: string }, {}, Partial<IReceta>>,
    res: Response<ApiResponse>
  ): Promise<Response<ApiResponse>>;

  deleteReceta(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ): Promise<Response<ApiResponse>>;
}

const recetaController: IRecetaController = {
  getAllRecetas: async (req, res) => {
    try {
      const recetas = await Receta.find({});
      return res.status(200).json({ data: recetas });
    } catch (error) {
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.GENERAL.UNKNOWN(error) });
    }
  },

  getRecetaById: async (req, res) => {
    try {
      const receta = await Receta.findById(req.params.id);
      if (!receta) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      return res.status(200).json({ data: receta });
    } catch (error) {
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.GENERAL.UNKNOWN(error) });
    }
  },

  createReceta: async (req, res) => {
    try {
      const newReceta = await Receta.create(req.body);
      return res.status(201).json({
        message: SUCCESS_MESSAGES.RECETA.CREATED,
        data: newReceta,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.GENERAL.UNKNOWN(error) });
    }
  },

  updateReceta: async (req, res) => {
    try {
      const recetaActualizada = await Receta.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!recetaActualizada) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      return res.status(200).json({
        message: "Receta actualizada correctamente",
        data: recetaActualizada,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.GENERAL.UNKNOWN(error) });
    }
  },

  patchReceta: async (req, res) => {
    try {
      const recetaActualizada = await Receta.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!recetaActualizada) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      return res.status(200).json({
        message: "Receta modificada parcialmente",
        data: recetaActualizada,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.GENERAL.UNKNOWN(error) });
    }
  },

  deleteReceta: async (req, res) => {
    try {
      const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
      if (!recetaEliminada) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      return res
        .status(200)
        .json({ message: "Receta eliminada correctamente" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.GENERAL.UNKNOWN(error) });
    }
  },
};

export default recetaController;
