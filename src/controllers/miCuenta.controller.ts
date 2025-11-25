import { Request, Response, NextFunction} from 'express';
// import { getAfiliadoByDocumento, obtenerGrupoFamiliar, registrarCBU } from '../validators/afiliado.validator';
import Afiliado from '../models/Afiliado';
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
  const { cbu } = req.params; 
  const datosActualizados = req.body;
  const nroDocumento = req.nroDocumento;


  try {
    
    const afiliado = await Afiliado.findOne({ nroDocumento });
    if (!afiliado) {
       res.status(404).json({ message: "Afiliado no encontrado" });
       return;
    }

    
    afiliado.cbuPrincipal = cbu;

    
    const cbuExistente = afiliado.cbus.find(item => item.cbu === cbu);
    if (cbuExistente) {
      Object.assign(cbuExistente, datosActualizados);
    } else {
      
      afiliado.cbus.push({ cbu, ...datosActualizados });
    }

    const actualizado = await afiliado.save();

     res.status(200).json({
      data: actualizado,
      message: "CBU principal actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
},

}


