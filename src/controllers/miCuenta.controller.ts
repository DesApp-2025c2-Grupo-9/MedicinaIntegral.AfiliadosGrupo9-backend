import { Request, Response, NextFunction} from 'express';
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
  editarCbu: (req: Request<{ cbu: string }, {}, DatosActualizados>,res: Response<ApiResponse>,next: NextFunction) => Promise<void>;
  eliminarCbu: (req: Request<{ id: string }, {}, { nroCbu: string }>, res: Response<ApiResponse>) => Promise<void>;
 
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
  
  editarCbu: async (req, res, next) => {
  const { cbu } = req.params; // ahora este param es el número de CBU
  const datosActualizados = req.body;

  try {
    // Buscar el CBU directamente por su número principal
    const cbuExistente = await CbuModel.findOne({ cbu });
    if (!cbuExistente) {
       res.status(404).json({ message: 'CBU no encontrado' });
       return;
    }

    Object.assign(cbuExistente, datosActualizados);
    const actualizado = await cbuExistente.save();

    res.status(200).json({
      data: actualizado,
      message: 'CBU actualizado correctamente',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
},

eliminarCbu: async (
  req: Request<{ id: string }, {}, { nroCbu: string }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nroCbu } = req.body;

    const afiliado = await Afiliado.findById(id);
    if (!afiliado) {
      res.status(404).json({ message: 'Afiliado no encontrado' });
      return;
    }

    const existe = afiliado.cbus.some(cbu => cbu.cbu === nroCbu);
    if (!existe) {
      res.status(404).json({ message: 'El CBU no existe en este afiliado' });
      return;
    }

    afiliado.cbus = afiliado.cbus.filter(cbu => cbu.cbu !== nroCbu);

    if (afiliado.cbuPrincipal === nroCbu) {
      afiliado.cbuPrincipal = null;
    }

    await afiliado.save();

    res.status(200).json({ message: 'CBU eliminado correctamente', data: afiliado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inesperado' });
  }
}

}



