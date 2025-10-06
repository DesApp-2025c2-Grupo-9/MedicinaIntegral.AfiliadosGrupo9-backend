import { EstadoDeTramite } from '../enums/EstadoDeTramite';
import { FormaDePago } from '../enums/FormaDePago';

interface IReintegro {
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

export default IReintegro;
