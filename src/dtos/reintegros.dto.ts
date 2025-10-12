import { IReintegroDocument } from '../models/Reintegro';

export class GetReintegrosDTO {
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
  formaDePago: string;
  cbu?: string;
  observaciones?: string;
  estado: string;

  constructor(data: IReintegroDocument) {
    // Recibe un documento de Mongo
    this.id = data._id.toString();
    this.paraAfiliado = data.paraAfiliado;
    this.fechaDePrestacion = data.fechaDePrestacion;
    this.especialidad = data.especialidad;
    this.medico = data.medico;
    this.lugarDeAtencion = data.lugarDeAtencion;
    this.factura = {
      fecha: data.factura.fecha,
      cuit: data.factura.cuit,
      valorTotal: data.factura.valorTotal,
      personaAFacturar: data.factura.personaAFacturar
    };
    this.formaDePago = data.formaDePago;
    this.cbu = data.cbu;
    this.observaciones = data.observaciones;
    this.estado = data.estado;
  }
}

export class PostReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class PutReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class DeleteReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}
