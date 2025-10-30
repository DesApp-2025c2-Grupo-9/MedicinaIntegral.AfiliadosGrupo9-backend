import { Request, Response } from "express";
import Receta from "../models/Receta";
import { IReceta } from "../interfaces/IReceta";
import { SUCCESS_MESSAGES } from "../utils/successMessages";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import {
  GetRecetasDTO,
  IdRecetaDTO,
  CommentRecetaDTO,
} from "../dtos/recetas.dto";
import { ApiResponse } from "../types/ApiResponse";
import { IObservacion } from "../interfaces/IObservacion";
import Afiliado from "../models/Afiliado";

interface IRecetaController {
  getAllRecetas(req: Request, res: Response<ApiResponse>): Promise<void>;
  createReceta(req: Request, res: Response<ApiResponse>): Promise<void>;
  updateReceta: (
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ) => Promise<void>;
  deleteReceta(
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ): Promise<void>;

  commentRecetaById: (
    req: Request<{ id: number }, {}, { comentario: string }>,
    res: Response<ApiResponse>
  ) => Promise<void>;
}
type UpdatedReceta = Omit<IReceta, "observaciones"> & {
  observaciones: string;
};

const recetaController: IRecetaController = {
  getAllRecetas: async (req, res) => {
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const recetas = await Receta.find({
        $and: [
          { idAfiliado: { $in: idsAfiliados } },
          { fechaBaja: { $exists: false } },
        ],
      });
      if (!recetas) {
        res.status(204).json({ message: "No hay recetas." });
        return;
      }
      const recetasDTO = recetas.map((receta) => new GetRecetasDTO(receta));
      console.log(recetasDTO);
      res.json({ data: recetasDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  createReceta: async (req, res) => {
    const idAfiliado = req.familiaresPermitidos?.[0]; // El primer id corresponde a quien hizo la petición
    const observacion: IObservacion = {
      // construimos la observación con el comentario que envió el afiliado
      idEmisor: idAfiliado!,
      rolEmisor: "Afiliado",
      descripcion: req.body.observaciones,
      fecha: new Date(),
    };
    try {
      const unAfiliado = await Afiliado.findById(idAfiliado);
      if (!unAfiliado) {
        res.status(404).json({ message: "no se encontró un afiliado" });
        return;
      }
      const recetaBody = {
        ...req.body,
        idAfiliado,
        nroAfiliado: unAfiliado.nroAfiliado,
        observaciones: [observacion],
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
    const descripcionObservacion = req.body.observaciones || "";
    const { id } = req.params;

    try {
      console.log(req.body);
      const receta = await Receta.findById(id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      if (!Array.isArray(receta.observaciones)) {
        receta.observaciones = [];
      }
      const updatedReceta: IObservacion = {
        ...(receta.observaciones[0] ?? {}),
        descripcion: descripcionObservacion,
        rolEmisor: "Afiliado",
        //fecha: new Date(),
      };

      const recetaBody = {
        ...req.body,
        observaciones: [updatedReceta],
      };
      Object.assign(receta, recetaBody);
      const recetaActualizada = await receta.save();
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
      const { id } = req.params;
      const receta = await Receta.findById(id);
      if (!receta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      receta.fechaBaja = new Date();
      await receta.save();

      res.status(200).json({
        data: new IdRecetaDTO(receta),
        message: SUCCESS_MESSAGES.RECETA.DELETED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },

  commentRecetaById: async (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;
    const idAfiliado = req.familiaresPermitidos?.[0];

    const observacion: IObservacion = {
      idEmisor: idAfiliado!,
      rolEmisor: "Afiliado",
      descripcion: comentario,
      fecha: new Date(),
    };

    try {
      const unaReceta = await Receta.findById(id);
      if (!unaReceta) {
        res.status(404).json({ message: ERROR_MESSAGES.RECETA.NOT_FOUND });
        return;
      }
      unaReceta.observaciones = [
        ...(unaReceta.observaciones || []),
        observacion,
      ];
      const commentedReceta = await unaReceta.save();
      const commentedRecetaDTO = new CommentRecetaDTO(commentedReceta);
      res.json({
        data: commentedRecetaDTO,
        message: SUCCESS_MESSAGES.RECETA.COMMENTED,
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
};
export default recetaController;
