import { Request, Response } from 'express';
import Afiliado from '../models/Afiliado';
import { ApiResponse } from '../types/ApiResponse';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { GetAfiliadoDTO } from '../dtos/afiliados.dto';
import { validarAfiliado } from '../validators/afiliado.validator';
import { validateGetAfiliadoRequest} from '../utils/getAfiliado.validacion';


interface IAfiliadoController {
  getAfiliado: (req: Request, res: Response<ApiResponse>) => Promise<Response|void>;
}

const afiliadoController: IAfiliadoController = {
  getAfiliado: async (req, res) => {
    const nroDocumento = req.nroDocumento;
    const idsAfiliados = req.familiaresPermitidos;
    if (!nroDocumento) {
      return res.status(400).json({ message: 'El número de documento es obligatorio.' });
    }
    
    const errores = validateGetAfiliadoRequest(nroDocumento);

    if (errores.length > 0) {
      return res.status(400).json({ message: errores.join(' | ') });
    }


    try {
      const unAfiliado = await Afiliado.findOne({ nroDocumento }).populate({
        path: 'grupoFamiliar',
        match: { _id: { $in: idsAfiliados } }
      });
      if (!unAfiliado) {
        return res.status(404).json({ message: 'No se encontró el afiliado.' });
      }

      const errores = validarAfiliado(unAfiliado);
      if (errores.length > 0) {
        return res.status(400).json({ message: `Datos inválidos del afiliado: ${errores.join('; ')}` });

        /* res.status(404).json({ message: 'No se pudo encontrar el afiliado.' });
        return; */
      }
      const unAfiliadoDTO = new GetAfiliadoDTO(unAfiliado);
      res.status(200).json({ data: unAfiliadoDTO });

      /* res.json({ data: unAfiliadoDTO }); */

    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
};
export default afiliadoController;
