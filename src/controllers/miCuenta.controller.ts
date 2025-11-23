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
  eliminarCbu: (req: Request<{ id: string }>, res: Response<ApiResponse>,next: NextFunction) => Promise<void>;
 
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
  const { cbu } = req.params; // número de CBU nuevo elegido como principal
  const datosActualizados = req.body;
  const nroDocumento = req.nroDocumento;


  try {
    // Buscar al afiliado por número de documento
    const afiliado = await Afiliado.findOne({ nroDocumento });
    if (!afiliado) {
       res.status(404).json({ message: "Afiliado no encontrado" });
       return;
    }

    // Actualizar el campo cbuPrincipal
    afiliado.cbuPrincipal = cbu;

    // Actualizar también los datos del CBU dentro del array
    const cbuExistente = afiliado.cbus.find(item => item.cbu === cbu);
    if (cbuExistente) {
      Object.assign(cbuExistente, datosActualizados);
    } else {
      // opcional: agregar el CBU si no existe
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

eliminarCbu: async (req, res, next) => {
  const { cbu } = req.params; 
  try {
    const afiliado = await Afiliado.findOne({ "cbus.cbu": cbu });
    if (!afiliado) {
      res.status(404).json({ message: "Afiliado no encontrado" });
      return;
    }

    // buscar el CBU dentro del array por su número
    const cbuEncontrado = afiliado.cbus.find(c => c.cbu === cbu);
    if (!cbuEncontrado) {
      res.status(404).json({ message: "CBU no encontrado" });
      return;
    }

    // eliminación lógica
    cbuEncontrado.activo = false;

    
    if (afiliado.cbuPrincipal === cbuEncontrado.cbu) {
    const otroActivo = afiliado.cbus.find(c => c.activo);
    afiliado.cbuPrincipal = otroActivo ? otroActivo.cbu : null;
}


    await afiliado.save();

    res.status(200).json({ message: "CBU marcado como eliminado" });
  } catch (error) {
    next(error);
  }
}

}


