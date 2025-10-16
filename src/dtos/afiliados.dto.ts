import { IAfiliadoDocument } from '../models/Afiliado';

interface IAfiliadoPopulated extends Omit<IAfiliadoDocument, 'grupoFamiliar'> {
  grupoFamiliar: IAfiliadoDocument[];
}

export class GetAfiliadoDTO {
  nombre: string;
  apellido: string;
  grupoFamiliar: { nombre: string; apellido: string }[];

  constructor(data: unknown) {
    const castedData = data as IAfiliadoPopulated;
    this.nombre = castedData.nombre;
    this.apellido = castedData.apellido;
    this.grupoFamiliar = castedData.grupoFamiliar?.map(doc => ({
      nombre: doc.nombre,
      apellido: doc.apellido
    }));
  }
}
