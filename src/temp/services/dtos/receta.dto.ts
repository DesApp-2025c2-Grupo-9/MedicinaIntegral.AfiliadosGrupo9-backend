export interface CreateRecetaDTO {
  nroAfiliado: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: Array<{
    emisor: string;
    descripcion: string;
    fecha?: Date;
  }>;
  estado?: string;
}

export interface UpdateRecetaDTO {
  medicamento?: string;
  cantidad?: number;
  presentacion?: string;
  observaciones?: Array<{
    emisor: string;
    descripcion: string;
    fecha?: Date;
  }>;
  estado?: string;
}
