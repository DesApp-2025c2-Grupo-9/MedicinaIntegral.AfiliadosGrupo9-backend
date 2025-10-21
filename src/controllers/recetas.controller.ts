import { Request, Response } from "express";
import Receta from "../models/Receta";
import { IReceta } from "../interfaces/IReceta";
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { GetRecetasDTO, IdRecetaDTO } from "../dtos/recetas.dto";
import { ApiResponse } from "../types/ApiResponse";
import { log } from "console";
import Afiliado from "../models/Afiliado";

interface IRecetaController {
  getAllRecetas(req: Request, res: Response<ApiResponse>): Promise<void>;
  getRecetasByGrupoFamiliar(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void>;
  getRecetaById(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ): Promise<void>;

  createReceta(
    req: Request<{}, {}, IReceta>,
    res: Response<ApiResponse>
  ): Promise<void>;
  createRecetaByGrupoFamiliar(
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
}

const recetaController: IRecetaController = {
  getAllRecetas: async (req, res) => {
    try {
      const recetas = await Receta.find();
      const recetasDTO = recetas.map((r) => new GetRecetasDTO(r));
      res.status(200).json({ data: recetasDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  getRecetasByGrupoFamiliar: async (req, res) => {
    try {
      const nroDocumentoUsuario = req.nroDocumento;
      const usuario = await Afiliado.findOne({
        nroDocumento: nroDocumentoUsuario,
      });
      const recetas = await Receta.find();
      if (!usuario) {
        throw new Error("No hay usuario");
      }
      const recetasDelGrupoFamiliar = await Receta.find({
        nroAfiliado: usuario.nroAfiliado,
      });
      console.log(recetas, usuario.nroAfiliado, recetasDelGrupoFamiliar);

      res.status(200).json({ data: recetasDelGrupoFamiliar });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  getRecetaById: async (req, res) => {
    try {
      const receta = await Receta.findById(req.params.id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      res.status(200).json({ data: new GetRecetasDTO(receta) });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  createReceta: async (req, res) => {
    try {
      const newReceta = await Receta.create(req.body);
      res.status(201).json({
        data: new IdRecetaDTO(newReceta),
        message: SUCCESS_MESSAGES.RECETA.CREATED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  createRecetaByGrupoFamiliar: async (req, res) => {
    const idAfiliado = req.familiaresPermitidos?.[0]; // El primer id corresponde a quien hizo la petición
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
    try {
      const recetaActualizada = await Receta.findByIdAndUpdate(
        req.params.id,
        req.body,
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

  patchReceta: async (req, res) => {
    try {
      const recetaActualizada = await Receta.findByIdAndUpdate(
        req.params.id,
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
