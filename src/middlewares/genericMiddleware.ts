import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose, { Model } from 'mongoose';

/* ============= LOG DE PETICIONES ============= */
export const logRequest = (req: Request, _: Response, next: NextFunction) => {
  console.log({
    method: req.method,
    url: req.url,
    fechaHora: new Date(),
    body: req.body,
    params: req.params,
  });
  next();
};

/* ============= ERROR PERSONALIZADO ============= */
export const errorPersonalizado = (
  message: string,
  status: number,
  next: NextFunction
) => {
  const err = new Error(message) as Error & { status?: number };
  err.status = status;
  return next(err);
};

/* ============= VERIFICA EXISTENCIA DE UN ID ============= */
export const existsModelById = (modelo: Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data = await modelo.findById(id);
      if (!data) {
        return errorPersonalizado(
          `${modelo.modelName} con id ${id} no se encuentra registrado en la base de datos`,
          404,
          next
        );
      }
    } catch (error) {
      return next(error);
    }
    next();
  };
};

/* ============= VERIFICA QUE EXISTA ALGÚN REGISTRO ============= */
export const existsAnyByModel = (modelo: Model<any>) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const data = await modelo.findOne();
      if (!data) {
        return errorPersonalizado(
          `No hay ningún ${modelo.modelName} registrado`,
          204,
          next
        );
      }
    } catch (error) {
      return next(error);
    }
    next();
  };
};

/* ============= VALIDAR CAMPOS EXACTOS ============= */
export const validarCamposExactos = (modelo: Model<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const camposValidos = Object.keys(modelo.schema.paths);
    const camposRecibidos = Object.keys(req.body);
    const camposInvalidos = camposRecibidos.filter(
      (campo) => !camposValidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
      return errorPersonalizado(`Hay campos inválidos`, 400, next);
    }
    next();
  };
};

/* ============= EXISTE MODELO EN REQUEST BODY ============= */
export const existModelRequest = (modelo: Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Recibe un modelo y lo compara con el body
    const nombreModelo = modelo.modelName;
    const modeloId = req.body[nombreModelo.toLowerCase() + 'Id'];
    if (!modeloId) {
      return errorPersonalizado(
        `El ID del ${modelo.modelName} es requerido`,
        400,
        next
      );
    }
    if (!mongoose.Types.ObjectId.isValid(modeloId)) {
      return errorPersonalizado(
        `El ID del ${modelo.modelName} es inválido`,
        400,
        next
      );
    }
    const aux = await modelo.findById(modeloId);
    if (!aux) {
      return errorPersonalizado(
        `${modelo.modelName} con ID ${modeloId} no encontrado`,
        404,
        next
      );
    }
    next();
  };
};

/* ============= MANEJO GLOBAL DE ERRORES ============= */
export const manejoDeErroresGlobales = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ error: messages });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ error: 'La imagen excede el tamaño máximo permitido de 5MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
};
