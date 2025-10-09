import { EstadoDeTramite } from '../../../enums/EstadoDeTramite';
import { FormaDePago } from '../../../enums/FormaDePago';
import IReintegro from '../../../interfaces/IReintegro';

export interface ReintegrosDTO {
  id: string;
  paraAfiliado: string;
  fechaDePrestacion: Date;
  especialidad: string;
  medico: string;
  lugarDeAtencion: string;
  factura: {
    fecha: Date;
    cuit: string;
    valorTotal: number;
    personaAFacturar: string;
  };
  formaDePago: FormaDePago;
  cbu?: string;
  observaciones?: string;
  estado: EstadoDeTramite;
}

export const allReintegrosDTO = (arg: IReintegro[]): ReintegrosDTO[] => {
  return arg.map(entry => ({ ...entry }));
};
