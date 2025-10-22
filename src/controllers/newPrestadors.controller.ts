import { ApiResponse } from '../types/ApiResponse';
import { Request, Response } from 'express';
import path from 'path'
import fs from 'fs'
export interface Direccion {
  calle: string;
  numero: string;
  localidad: string;
  comuna: string | null;
  municipio: string | null;
  provincia: string;
  horariosAtencion: string[];
}

export interface Prestador {
  _id: string;
  nombreCompleto: string;
  cuitCuil: string;
  esCentroMedico: boolean;
  especialidades: string[];
  telefonos: string[];
  mails: string[];
  direcciones: Direccion[];
  integraCentroMedico?: string | null; // Propiedad opcional
  atencionParticular?: boolean;     // Propiedad opcional
}

export interface EspecialidadLocalidad {
    especialidad: string;
    localidades: string[];
}

const newPrestadoresFilePath = path.resolve(__dirname, "../json/newPrestadores.json");
const newPrestadores = JSON.parse(fs.readFileSync(newPrestadoresFilePath, "utf-8"));

export const getEspecialidadesConLocalidades = (req: Request, res: Response): void => {
    
    const especialidadesMap: Record<string, Set<string>> = {};

    for (const prestador of newPrestadores) {
        
        // --- CORRECCIÓN 1: Tipar el parámetro 'dir' ---
        const localidadesDelPrestador = new Set<string>(
            prestador.direcciones.map((dir: Direccion) => dir.localidad.trim())
        );

        for (const especialidad of prestador.especialidades) {
            const espTrim = especialidad.trim();

            if (!especialidadesMap[espTrim]) {
                especialidadesMap[espTrim] = new Set<string>();
            }

            // --- CORRECCIÓN 2: Tipar el parámetro 'localidad' (buena práctica) ---
            localidadesDelPrestador.forEach((localidad: string) => {
                especialidadesMap[espTrim].add(localidad);
            });
        }
    }

    const resultadoFinal: EspecialidadLocalidad[] = Object.keys(especialidadesMap).map(especialidad => ({
        especialidad: especialidad,
        localidades: Array.from(especialidadesMap[especialidad]) 
    }));

    res.status(200).json(resultadoFinal);
};