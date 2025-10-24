import { Request, Response } from 'express';
import path from 'path'
import fs from 'fs'
import { Direccion} from '../interfaces/INewPrestador';

const newPrestadoresFilePath = path.resolve(__dirname, "../json/newPrestadores.json");
const newPrestadores = JSON.parse(fs.readFileSync(newPrestadoresFilePath, "utf-8"));

interface Medico {
  nombreCompleto: string;
  especialidades: string[];
  direcciones: Direccion[];
  esCentroMedico: boolean;
  integraCentroMedico?: string | null;
  atencionParticular?: boolean;
}

interface EspecialidadLocalidadMedicos {
  especialidad: string;
  localidades: Record<string, Medico[]>;
}

export const getEspecialidadesConLocalidadesYMedicos = (req: Request, res: Response): void => {
  const medicos: Medico[] = (newPrestadores as Medico[]).filter(p => !p.esCentroMedico);
  const centros = (newPrestadores as Medico[]).filter(p => p.esCentroMedico);

  const byNombreCentro = new Map<string, Medico>(
    centros.map(c => [c.nombreCompleto.trim(), c])
  );

  const normalize = (s?: string) =>
    (s || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

  const especialidadesMap: Record<string, Record<string, Medico[]>> = {};

  const getDireccionesDeMedico = (m: Medico): Direccion[] => {
    const tienePropias = Array.isArray(m.direcciones) && m.direcciones.length > 0;

    // 1) Si tiene direcciones propias, usarlas SIEMPRE (aunque atencionParticular sea false)
    if (tienePropias) return m.direcciones;

    // 2) Si integra centro, usar direcciones del centro
    if (m.integraCentroMedico) {
      const centro = byNombreCentro.get(m.integraCentroMedico.trim());
      if (!centro) return [];

      // Si el médico NO tiene direcciones propias, pero sí sabemos de qué localidades es,
      // podés filtrar por localidad. (Por si la data del médico trae localidad “resumida”)
      // Si no, devolvé todas las del centro.
      return centro.direcciones || [];
    }

    // 3) Caso sin centro ni direcciones → nada
    return [];
  };

  for (const medico of medicos) {
    const direcciones = getDireccionesDeMedico(medico);

    for (const esp of medico.especialidades || []) {
      const espKey = esp?.trim();
      if (!espKey) continue;

      if (!especialidadesMap[espKey]) especialidadesMap[espKey] = {};

      // Si el médico no tiene direcciones resolubles, no lo indexamos en ninguna localidad
      for (const dir of direcciones) {
        const loc = dir?.localidad?.trim();
        if (!loc) continue;

        if (!especialidadesMap[espKey][loc]) {
          especialidadesMap[espKey][loc] = [];
        }

        // Evitar duplicados por si el médico aparece dos veces con la misma localidad
        const yaEsta = especialidadesMap[espKey][loc]
          .some(m => normalize(m.nombreCompleto) === normalize(medico.nombreCompleto));
        if (!yaEsta) {
          especialidadesMap[espKey][loc].push(medico);
        }
      }
    }
  }

  const resultadoFinal: EspecialidadLocalidadMedicos[] = Object.entries(especialidadesMap).map(
    ([especialidad, localidades]) => ({
      especialidad,
      localidades,
    })
  );

  res.status(200).json(resultadoFinal);
};
