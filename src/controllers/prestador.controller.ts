import { Request, Response } from "express";
import { Prestador } from "../models/Prestador";

interface IPrestadorController {
  getPrestadores: (req: Request, res: Response) => Promise<void>;
}

const prestadorController: IPrestadorController = {
  getPrestadores: async (req, res) => {
    try {
      const { especialidad, localidad } = req.query;
      const filtro: any = {};

      //  Si especialidad llega como string o array, soporta ambos casos
      if (especialidad) {
        filtro.especialidad = {
          $in: Array.isArray(especialidad) ? especialidad : [especialidad],
        };
      }

      //  Coincidencia por localidad dentro del subdocumento lugarAtencion
      if (localidad) {
        filtro["lugarAtencion.localidad"] = localidad;
      }

      const prestadores = await Prestador.find(filtro);

      if (prestadores.length === 0) {
        res
          .status(404)
          .json({ message: "No se encontraron prestadores con esos filtros." });
        return;
      }

      res.status(200).json(prestadores);
    } catch (error) {
      console.error("Error en getPrestadores:", error);
      res.status(500).json({ message: "Error al obtener los prestadores." });
    }
  },
};

export default prestadorController;
