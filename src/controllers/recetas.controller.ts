import { Request, Response } from "express";
import Receta from "../models/Receta";
import { IReceta } from "../interfaces/IReceta";
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { GetRecetasDTO, IdRecetaDTO } from "../dtos/recetas.dto";
import { ApiResponse } from "../types/ApiResponse";
import { log } from "console";
import mongoose from "mongoose";
import Afiliado from "../models/Afiliado";

interface IRecetaController {
  getAllRecetas(req: Request, res: Response<ApiResponse>): Promise<void>;
  getRecetasByGrupoFamiliar(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void | Response>;

  createReceta(
    req: Request<{}, {}, IReceta>,
    res: Response<ApiResponse>
  ): Promise<void>;

  updateReceta(
    req: Request<{ id: string }, {}, Partial<IReceta>>,
    res: Response<ApiResponse>
  ): Promise<void>;

  patchReceta(
    req: Request<{ id: string }, {}, Partial<IReceta>>,
    res: Response<ApiResponse>
  ): Promise<void>;

  deleteReceta(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ): Promise<void>;
  deleteSoftReceta(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ): Promise<void>;
}

const recetaController: IRecetaController = {
  getAllRecetas: async (req, res) => {
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const recetas = await Receta.find({
        idAfiliado: { $in: idsAfiliados },
        activo: true,
      });
      const recetasDTO = recetas.map((receta) => new GetRecetasDTO(receta));
      console.log(recetasDTO);
      res.json({ data: recetasDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  getRecetasByGrupoFamiliar: async (req, res) => {
    try {
      const idsAfiliados = req.familiaresPermitidos ?? [];

      if (!idsAfiliados.length) {
        return res
          .status(400)
          .json({ message: "No hay familiares permitidos en el token" });
      }

      const objectIds = idsAfiliados.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const recetas = await Receta.find({
        idAfiliado: { $in: objectIds },
      }).populate("idAfiliado");

      const recetasDTO = recetas.map((r) => new GetRecetasDTO(r));

      console.log("Recetas del grupo familiar:", recetasDTO);
      res.status(200).json({ data: recetasDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  createReceta: async (req, res) => {
    const idAfiliado = req.familiaresPermitidos?.[0];
    const recetaBody = {
      ...req.body,
      idAfiliado,
    };

    try {
      const newReceta = await Receta.create(recetaBody);
      const newRecetaDTO = new IdRecetaDTO(newReceta);
      res.json({
        data: newRecetaDTO,
        message: SUCCESS_MESSAGES.RECETA.CREATED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  updateReceta: async (req, res) => {
    const { id } = req.params;

    try {
      const receta = await Receta.findById(id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      Object.assign(receta, req.body);
      const updatedReceta = await receta.save();
      const updatedRecetaDTO = new IdRecetaDTO(updatedReceta);
      res.json({
        data: updatedRecetaDTO,
        message: SUCCESS_MESSAGES.RECETA.UPDATED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  patchReceta: async (req, res) => {
    try {
      const { id } = req.params;

      const recetaActualizada = await Receta.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!recetaActualizada) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      res.status(200).json({
        data: new IdRecetaDTO(recetaActualizada),
        message: SUCCESS_MESSAGES.RECETA.UPDATED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  deleteSoftReceta: async (req, res) => {
    try {
      const { id } = req.params;

      const receta = await Receta.findById(id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }

      if (!receta.activo) {
        res.status(400).json({ message: "La receta ya está eliminada." });
        return;
      }

      receta.activo = false;
      await receta.save();

      res.status(200).json({
        message:
          SUCCESS_MESSAGES.RECETA.DELETED ||
          "Receta eliminada correctamente (soft delete).",
        data: new IdRecetaDTO(receta),
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  deleteReceta: async (req, res) => {
    try {
      const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
      if (!recetaEliminada) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      res.status(200).json({
        data: new IdRecetaDTO(recetaEliminada),
        message: SUCCESS_MESSAGES.RECETA.DELETED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
};

export default recetaController;
