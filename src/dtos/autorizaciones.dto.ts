import { IAutorizacionDocument }  from "../models/Autorizacion";
import { IObservacion } from "../interfaces/IObservacion";

interface IAutorizacionWithRol extends Omit<IAutorizacionDocument, 'idAfiliado'> {
    idAfiliado: {rol: string}
}

export class GetAutorizacionesDTO {
    id: string;
    paraAfiliado: string;
    rolAfiliado: string;
    nroAfiliado?: string; 
    fechaSolicitud: Date;
    practica: string;
    especialidad: string;
    medicoSolicitante: string;
    lugarAtencion: string;
    observaciones: IObservacion[];
    diasDeInternacion: number;
    estado: string;
    createdAt?: Date;
    fechaAprobacion?: Date;

    constructor(data: unknown) {
        const castedData = data as IAutorizacionWithRol;
        this.id = castedData._id.toString();
        this.paraAfiliado = castedData.paraAfiliado;    
        this.rolAfiliado = castedData.idAfiliado.rol;
        this.nroAfiliado = castedData.nroAfiliado;    
        this.fechaSolicitud = castedData.fechaSolicitud;
        this.practica = castedData.practica;
        this.especialidad = castedData.especialidad;
        this.medicoSolicitante = castedData.medicoSolicitante;
        this.lugarAtencion = castedData.lugarAtencion;
        this.observaciones = castedData.observaciones;
        this.diasDeInternacion = castedData.diasDeInternacion;
        this.estado = castedData.estado;
        this.createdAt = castedData.createdAt;
        this.fechaAprobacion = castedData.fechaAprobacion;

    }
}

export class IdAutorizacionDTO {
    id: string;

    constructor(castedData: IAutorizacionDocument) {
        this.id = castedData._id.toString();
    }
}


export class CommentAutorizacionDTO {
    id: string;
    observaciones: IObservacion[];

    constructor(castedData: IAutorizacionDocument) {
        this.id = castedData._id.toString();
        this.observaciones = castedData.observaciones;
    }
}