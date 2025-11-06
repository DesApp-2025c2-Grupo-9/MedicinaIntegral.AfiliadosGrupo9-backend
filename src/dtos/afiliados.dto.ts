import { IAfiliadoDocument } from '../models/Afiliado';

export interface IAfiliadoPopulated extends Omit<IAfiliadoDocument, 'grupoFamiliar'> {
  grupoFamiliar: IAfiliadoDocument[];
}

export class GetAfiliadoDTO {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  grupoFamiliar: { id: string; nombre: string; apellido: string; rol: string }[];

  constructor(data: unknown) {
    const castedData = data as IAfiliadoPopulated;
    this.id = castedData._id.toString();
    this.nombre = castedData.nombre;
    this.apellido = castedData.apellido;
    this.rol = castedData.rol;
    this.grupoFamiliar = castedData.grupoFamiliar?.map(doc => ({
      id: doc._id.toString(),
      nombre: doc.nombre,
      apellido: doc.apellido,
      rol: doc.rol
    }));
  }
}
