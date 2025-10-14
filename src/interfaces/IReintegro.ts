import { Types } from 'mongoose';
import { Especialidad } from '../enums/Especialidad';
import { EstadoTramite } from '../enums/EstadoTramite';
import { FormaPago } from '../enums/FormaPago';

interface IReintegro {
  id: string;
  paraAfiliado: string;
  fechaDePrestacion: Date;
  especialidad: Especialidad;
  medico: string;
  lugarDeAtencion: string;
  factura: {
    fecha: Date;
    cuit: string;
    valorTotal: number;
    personaAFacturar: string;
  };
  formaDePago: FormaPago; // 'transferencia' | 'efectivo' | 'cheque'
  cbu?: string; // Si formaDePago === 'transferencia', cbu es required
  // observaciones?: IObservacion[];
  observaciones?: string;
  estado: EstadoTramite; // 'pendiente' | 'observado' | 'aceptado' | 'rechazado'
  idAfiliado: Types.ObjectId
}

export default IReintegro;
