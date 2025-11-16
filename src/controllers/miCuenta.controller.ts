import { Request, Response } from 'express';
// import { getAfiliadoByDocumento, obtenerGrupoFamiliar, registrarCBU } from '../validators/afiliado.validator';
import Afiliado from '../models/Afiliado';
import  CbuModel  from '../models/Cbu';
import { ApiResponse } from '../types/ApiResponse';
import { MiCuentaDTO } from '../dtos/miCuenta.dto';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { DatosActualizados } from '../types/CbuTypes';


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    rol?: string;
    nroDocumento?: string;
  };
}

type CBU = {
  tipoDeCuenta: string;
  cuil: string;
  nombre: string;
  apellido: string;
  cbu: string;
};

interface IMiCuentaController {
  getMiCuenta: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  registrarCbu: (req: Request<{}, {}, CBU>, res: Response<ApiResponse>) => Promise<void>;
  setCbuPrincipal: (req: Request<{}, {}, { nroCbu: string }>, res: Response<ApiResponse>) => Promise<void>;
  editarCbu: (req: Request<{ cbu: string }, {}, DatosActualizados>,res: Response<ApiResponse>) => Promise<void>;

}

export const miCuentaController: IMiCuentaController = {
  getMiCuenta: async (req, res) => {
    const nroDocumento = req.nroDocumento;
    const idsAfiliados = req.familiaresPermitidos;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento }).populate({
        path: 'grupoFamiliar',
        match: { _id: { $in: idsAfiliados } }
      });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se pudieron encontrar datos del afiliado solicitado.' });
        return;
      }

      const miCuentaDTO = new MiCuentaDTO(unAfiliado);
      res.json({ data: miCuentaDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  registrarCbu: async (req, res) => {
    const nroDocumento = req.nroDocumento;

    try {
      const cbuRecibido = req.body;
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se pudieron encontrar datos del afiliado solicitado.' });
        return;
      }

      const cbuYaRegistrado = unAfiliado.cbus.some(cbu => cbu.cbu === cbuRecibido.cbu);
      if (cbuYaRegistrado) {
        res.status(409).json({ message: 'Este CBU ya está registrado.' });
        return;
      }

      unAfiliado.cbus = [...unAfiliado.cbus, cbuRecibido];
      await unAfiliado.save();

      res.json({ message: 'CBU registrado exitosamente.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  setCbuPrincipal: async (req, res) => {
    const nroDocumento = req.nroDocumento;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se pudieron encontrar datos del afiliado solicitado.' });
        return;
      }

      unAfiliado.cbuPrincipal = req.body.nroCbu;
      await unAfiliado.save();

      res.json({ message: 'El CBU ha sido elegido como principal exitosamente.' });
    } catch (error) {}
  },
  editarCbu: async (req, res) => {
  const { cbu } = req.params;
  const datosActualizados = req.body;

  const cbuExistente = await CbuModel.findOne({ cbu });

  if (!cbuExistente) {
    res.status(404).json({ message: 'CBU no encontrado' });
    return;
  }

  Object.assign(cbuExistente, datosActualizados);
  const actualizado = await cbuExistente.save();

  res.status(200).json({ message: 'CBU actualizado correctamente', data: actualizado });
}
}
/* export const MiCuentaController2 = {
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
}; */
