import { Request, Response } from 'express';
import Afiliado from '../models/Afiliado';
import { ApiResponse } from '../types/ApiResponse';
import { MiCuentaDTO } from '../dtos/miCuenta.dto';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { CBU } from '../types/CBU';

interface IMiCuentaController {
  getMiCuenta: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  registerCbu: (req: Request<{}, {}, CBU>, res: Response<ApiResponse>) => Promise<void>;
  setMainCbu: (req: Request<{}, {}, { nroCbu: string }>, res: Response<ApiResponse>) => Promise<void>;
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
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      const miCuentaDTO = new MiCuentaDTO(unAfiliado);
      res.json({ data: miCuentaDTO });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  registerCbu: async (req, res) => {
    const nroDocumento = req.nroDocumento;

    try {
      const cbuBody = req.body;
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      const cbuEnUso = unAfiliado.cbus.some(entry => entry.cbu === cbuBody.cbu);
      if (cbuEnUso) {
        res.status(409).json({ message: 'El CBU ingresado ya se encuentra registrado.' });
        return;
      }

      unAfiliado.cbus = [...unAfiliado.cbus, cbuBody];
      await unAfiliado.save();

      res.json({ message: 'El CBU fue registrado exitosamente.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  setMainCbu: async (req, res) => {
    const nroDocumento = req.nroDocumento;

    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento });
      if (!unAfiliado) {
        res.status(404).json({ message: 'No se encontraron datos del afiliado solicitado.' });
        return;
      }

      unAfiliado.cbuPrincipal = req.body.nroCbu;
      await unAfiliado.save();

      res.json({ message: 'El CBU se ha elegido como principal exitosamente.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
};
