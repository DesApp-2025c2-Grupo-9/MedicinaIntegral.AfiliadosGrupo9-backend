import { EstadoTramite } from "../enums/EstadoTramite";
import { FormaPago } from "../enums/FormaPago";

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
  formaDePago: FormaPago;
  cbu?: string;
  observaciones?: string;
  estado: EstadoTramite;
}

export default IReintegro;
