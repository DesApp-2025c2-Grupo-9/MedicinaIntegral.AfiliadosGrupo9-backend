import { Request, Response } from 'express';
import { obtenerAfiliadoPorId, obtenerGrupoFamiliar, registrarCBU } from '../validators/afiliado.validator';


interface AuthenticatedRequest extends Request { //chequear esto
  user?: {
    id: string;
    rol?: string;
    nroDocumento?: string;
  };
}

export const MiCuentaController = {
  obtenerMiCuenta: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const afiliado = await obtenerAfiliadoPorId(userId);
      if (!afiliado) {
        return res.status(404).json({ error: 'Afiliado no encontrado' });
      }

      const grupoFamiliar = await obtenerGrupoFamiliar(userId);
      return res.json({ afiliado, grupoFamiliar });
    } catch (error) {
      console.error('Error al obtener mi cuenta:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    }


  },

  registrarCBU: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const { nombre, apellido, cbu, tipoDeCuenta, cuil } = req.body;
      if (!nombre || !apellido || !cbu || !tipoDeCuenta || !cuil) {
        return res.status(400).json({ error: 'Faltan datos requeridos para registrar el CBU' });
      }

      await registrarCBU(userId, { nombre, apellido, cbu, tipoDeCuenta, cuil });

      res.status(201).json({ mensaje: 'CBU registrado correctamente' });
    } catch (error) {
       console.error('Error al registrar CBU:', error);
        if (!res.headersSent) {
          return res.status(400).json({ error: 'No se pudo registrar el CBU' });
        }
    }
  }

};
