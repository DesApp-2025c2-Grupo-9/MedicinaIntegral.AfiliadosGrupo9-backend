import { EstadoTramite } from "../enums/EstadoTramite";

export interface IAutorizacion {
  id: string;
  nroAfiliado: string; // referencia al Afiliado
  fechaSolicitud: Date;
  practica: string;
  especialidad: string;
  medicoSolicitante: string;
  lugarAtencion: string;
  diagnostico?: string;
  observaciones?: string;
  diasDeInternacion: number;
  estado: EstadoTramite;
}

export default IAutorizacion;
