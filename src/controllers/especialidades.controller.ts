import { Request, Response } from 'express';
import { ApiResponse } from '../types/ApiResponse';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import Prestador from '../models/Prestador';

export const getEspecialidades = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  //Se modificó este controller. Ahora devuelve las especialidades que encuentre en los prestadores
    try {
    const especialidades: string[] = await Prestador.distinct(
      "especialidad", {
        especialidad: {$exists: true, $ne: ""}//Que exista y no sea vacio
      }
    )
    //Lo ordenamos alfabeticamente
    especialidades.sort((a,b) => a.localeCompare(b, "es"));
    res.json({ data: especialidades });
  } catch (error) {
    const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
    res.status(500).json({ message });
  }
};
