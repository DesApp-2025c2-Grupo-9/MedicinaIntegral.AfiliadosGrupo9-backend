import { Request, Response } from 'express';
import { Especialidad } from '../enums/Especialidad';
import { ApiResponse } from '../types/ApiResponse';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export const getEspecialidades = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const especialidades = Object.values(Especialidad);
    res.json({ data: especialidades });
  } catch (error) {
    const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
    res.status(500).json({ message });
  }
};
