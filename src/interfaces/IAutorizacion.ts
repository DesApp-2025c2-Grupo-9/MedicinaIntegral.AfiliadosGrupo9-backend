import { EstadoTramite } from "../enums/EstadoTramite";
import { IObservacion } from "./IObservacion";

export interface IAutorizacion {
  id: string;
  nroAfiliado: string; // referencia al Afiliado
  fechaSolicitud: Date;
  practica: string;
  especialidad: string;
  medicoSolicitante: string;
  lugarAtencion: string;
  diagnostico?: string;
  observaciones?: IObservacion[];
  diasDeInternacion: number;
  estado: EstadoTramite;
}

export default IAutorizacion;
