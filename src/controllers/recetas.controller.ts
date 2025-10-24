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
import { IObservacion } from '../interfaces/IObservacion';

interface IRecetaController {
  getAllRecetas(req: Request, res: Response<ApiResponse>): Promise<void>;
  createReceta(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void>;

  updateReceta(
    req: Request<{ id: string }, {}, Partial<IReceta>>,
    res: Response<ApiResponse>
  ): Promise<void>;

  deleteReceta(
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

  createReceta: async (req, res) => {
    const idAfiliado = req.familiaresPermitidos?.[0];
    const observacion: IObservacion = {
      // construimos la observación con el comentario que envió el afiliado
      idEmisor: idAfiliado!,
      rolEmisor: 'Afiliado',
      descripcion: req.body.observaciones,
      fecha: new Date()
    };

    try {
      const unAfiliado = await Afiliado.findById(idAfiliado);
      if (!unAfiliado) {
        // ...
      }

      const recetaBody = {
        ...req.body,
        idAfiliado,
        observaciones: [observacion],
        nroAfiliado: unAfiliado?.nroAfiliado
      };
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
  deleteReceta: async (req, res) => {
    try {
      const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
      if (!recetaEliminada) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
// recetaEliminada.fechaBaja = new Date()
// awawit recetaEliminada.save()

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
