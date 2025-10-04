import { Document, Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { FormaPago } from "../enums/FormaPago";

export interface IReintegro {
  nroAfiliado: string;
  fechaPrestacion: Date;
  medico: string;
  especialidad: string;
  lugarAtencion: string;
  factura: {
    fecha: Date;
    cuit?: string;
    valorTotal: number;
    personaAFacturar: string | Types.ObjectId; //para poder relacionar o no con un afiliado
  };
  formaPago: FormaPago;
  observaciones?: string;
  estado: EstadoTramite;
}

export interface IReintegroDocument extends IReintegro, Document {}
