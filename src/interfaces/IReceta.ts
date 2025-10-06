import { Document } from "mongoose";
import { EstadoTramite } from "../enums/EstadoDeTramite";

export interface IReceta {
  nroAfiliado: string; // clave foránea a Afiliado
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: string;
  estado: EstadoTramite;
}
export interface IRecetaDocument extends IReceta, Document {}
