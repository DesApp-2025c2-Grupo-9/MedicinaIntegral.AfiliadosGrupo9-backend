import { Types } from 'mongoose';
import { Especialidad } from '../enums/Especialidad';
import { EstadoTramite } from '../enums/EstadoTramite';
import { FormaPago } from '../enums/FormaPago';
import { IObservacion } from './IObservacion';

interface IReintegro {
  id: string;
  paraAfiliado: string;
  fechaDePrestacion: Date;
  especialidad: Especialidad; // 'Medicina General' | 'Pediatría' | 'Ginecología' | 'Cardiología' | 'Dermatología' | 'Neurología' | 'Psiquiatría' | 'Traumatología' | 'Oftalmología' | 'Cirugía General'
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
  observaciones?: string;
  estado: EstadoTramite; // 'pendiente' | 'observado' | 'aceptado' | 'rechazado'
  idAfiliado: Types.ObjectId;
  fechaBaja?: Date;
}

export default IReintegro;
