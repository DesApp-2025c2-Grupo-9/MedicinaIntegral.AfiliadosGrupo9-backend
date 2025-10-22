import { Request, Response } from 'express';
import { Especialidad } from '../enums/Especialidad';
import { ApiResponse } from '../types/ApiResponse';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import path from 'path';
import fs from 'fs';

export const getEspecialidades = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const especialidades = Object.values(Especialidad);
    res.json({ data: especialidades });
  } catch (error) {
    const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
    res.status(500).json({ message });
  }
};

/**
 * Obtiene todas las especialidades únicas presentes en los prestadores
 */
export const getEspecialidadesUnicas = (req: Request, res: Response) => {
  try {
    const newPrestadoresFilePath = path.resolve(__dirname, "../json/newPrestadores.json");
    const newPrestadores = JSON.parse(fs.readFileSync(newPrestadoresFilePath, "utf-8"));
    const setEspecialidades = new Set<string>();

    for (const prestador of newPrestadores) {
      for (const especialidad of prestador.especialidades) {
        setEspecialidades.add(especialidad.trim());
      }
    }

    // Convertimos el Set a array y lo ordenamos
    const especialidadesOrdenadas = Array.from(setEspecialidades).sort((a, b) =>
      a.localeCompare(b)
    );

    // Devolvemos un array en "data" para que el front lo reciba como tal
    return res.json({ data: especialidadesOrdenadas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener especialidades" });
  }
};
