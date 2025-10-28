import { Request, Response } from 'express';
import { getAfiliadoByDocumento, obtenerGrupoFamiliar, registrarCBU } from '../validators/afiliado.validator';


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol?: string;
    nroDocumento?: string;
  };
}

export const MiCuentaController = {
  obtenerMiCuenta: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const nroDocumento = req.nroDocumento;
      if (!nroDocumento) return res.status(401).json({ error: 'Usuario no autenticado' });

      
      const afiliado = await getAfiliadoByDocumento(nroDocumento);
      const grupoFamiliar = await obtenerGrupoFamiliar(nroDocumento);


      res.json({ afiliado, grupoFamiliar });
    } catch (error) {
      console.error('Error al obtener mi cuenta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  registrarCBU: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

      const { nombre, apellido, cbu, tipoDeCuenta, cuil } = req.body;

      await registrarCBU(userId, { nombre, apellido, cbu, tipoDeCuenta, cuil });

      res.status(201).json({ mensaje: 'CBU registrado correctamente' });
    } catch (error) {
      console.error('Error al registrar CBU:', error);
      res.status(400).json({ error: 'No se pudo registrar el CBU' });
    }
  }
};