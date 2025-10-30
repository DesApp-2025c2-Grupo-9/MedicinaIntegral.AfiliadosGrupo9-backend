import { Request, Response } from "express";
import { PrestadorDTO } from "../dtos/prestador.dto";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";

const prestadoresData: any[] = require("../json/prestadores.json");

const prestadorController = {
  //  prestadores filtrados por especialidad y/o localidad
  getPrestadores: (req: Request, res: Response) => {
    try {
      const especialidad = req.query.especialidad as string | undefined;
      const localidad = req.query.localidad as string | undefined;

      let resultado = prestadoresData;

      // Filtrar por especialidad si es un valor válido del enum
      if (
        especialidad &&
        Object.values(Especialidad).includes(especialidad as Especialidad)
      ) {
        resultado = resultado.filter((p) => p.especialidad === especialidad);
      }

      // Filtrar por localidad si es un valor válido del enum
      if (
        localidad &&
        Object.values(Localidad).includes(localidad as Localidad)
      ) {
        resultado = resultado.filter(
          (p) =>
            p.lugarAtencion.localidad.toLowerCase() === localidad.toLowerCase()
        );
      }

      if (!resultado || resultado.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron prestadores con esos filtros." });
      }

      const result = resultado.map((p) => new PrestadorDTO(p));
      res.status(200).json(result);
    } catch (error) {
      console.error(" Error en getPrestadores:", error);
      res.status(500).json({ message: "Error al filtrar prestadores" });
    }
  },
};

export default prestadorController;
