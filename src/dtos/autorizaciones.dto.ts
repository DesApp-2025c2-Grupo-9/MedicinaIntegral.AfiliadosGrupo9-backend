import { IAutorizacionDocument }  from "../models/Autorizacion";

export class GetAutorizacionesDTO {
    id: string;
    nroAfiliado: string; 
    fechaSolicitud: Date;
    practica: string;
    especialidad: string;
    medicoSolicitante: string;
    lugarAtencion: string;
    observaciones?: string;
    diasDeInternacion: number;
    estado: string;

    constructor(data: IAutorizacionDocument) {
        this.id = data._id.toString();
        this.nroAfiliado = data.nroAfiliado;    
        this.fechaSolicitud = data.fechaSolicitud;
        this.practica = data.practica;
        this.especialidad = data.especialidad;
        this.medicoSolicitante = data.medicoSolicitante;
        this.lugarAtencion = data.lugarAtencion;
        this.observaciones = data.observaciones;
        this.diasDeInternacion = data.diasDeInternacion;
        this.estado = data.estado;
    }
}

export class IdAutorizacionDTO {
    id: string;

    constructor(data: IAutorizacionDocument) {
        this.id = data._id.toString();
    }
}