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
  editarCbu: async (
  req: Request<{ cbu: string }, {}, DatosActualizados & { nroCbu?: string; principal?: boolean }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { cbu } = req.params;
    const datosActualizados = req.body;
    const cbuNormalizado = cbu.replace(/[-\s]/g, '');

    const cbuExistente = await CbuModel.findOne({ cbu: cbuNormalizado });
    if (!cbuExistente) {
      res.status(404).json({ message: 'CBU no encontrado' });
      return;
    }

    
    if (datosActualizados.principal === true) {
      
      const unAfiliado = await Afiliado.findOne({ cuil: cbuExistente.cuil });
      if (!unAfiliado) {
        res.status(404).json({ message: 'Afiliado no encontrado' });
        return;
      }

      
      unAfiliado.cbuPrincipal = cbuExistente.cbu;
      await unAfiliado.save();
    }

    Object.assign(cbuExistente, datosActualizados);
    const actualizado = await cbuExistente.save();

    res.status(200).json({ message: 'CBU actualizado correctamente', data: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inesperado' });
  }
}
}

