import { EstadoTramite } from "../enums/EstadoTramite";
import { FormaPago } from "../enums/FormaPago";

interface IReintegro {
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
  formaDePago: FormaPago; // 'transferencia' | 'efectivo' | 'cheque'
  cbu?: string; // Si formaDePago === 'transferencia', cbu es required
  observaciones?: string;
  estado: EstadoTramite; // 'pendiente' | 'observado' | 'aceptado' | 'rechazado'
}

export default IReintegro;
