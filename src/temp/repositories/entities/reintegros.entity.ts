import IReintegro from '../../../interfaces/IReintegro';
import { IReintegroDocument } from '../../../models/Reintegro';

// Entidad interna; normaliza la respuesta de la base de datos;
const Reintegro = (data: IReintegroDocument): IReintegro => {
  return {
    id: data._id.toString(),
    paraAfiliado: data.paraAfiliado,
    fechaDePrestacion: data.fechaDePrestacion,
    especialidad: data.especialidad,
    medico: data.medico,
    lugarDeAtencion: data.lugarDeAtencion,
    factura: data.factura,
    formaDePago: data.formaDePago,
    cbu: data.cbu,
    observaciones: data.observaciones,
    estado: data.estado
  };
};

export default Reintegro;
