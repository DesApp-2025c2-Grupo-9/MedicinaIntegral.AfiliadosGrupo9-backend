

import { Request, Response } from "express";
import path from "path";
import fs from 'fs'
const turnosPath = path.resolve(__dirname, "../json/turnos.json");
const turnos = JSON.parse(fs.readFileSync(turnosPath, "utf-8"));
// convertir campo fechaTurno (string -> Date)
interface TurnoRaw {
    fechaTurno: string;
    disponible: boolean;
    especialidad: string;
    localidad: string;
    prestador?: string;
    [key: string]: any;
}

interface Turno extends Omit<TurnoRaw, "fechaTurno"> {
    fechaTurno: Date;
}

const turnosCol: Turno[] = (turnos as TurnoRaw[]).map(t => ({
    ...t,
    fechaTurno: new Date(t.fechaTurno),
}));


// util: normalizar para igualdad case-insensitive con collation
const COLLATION = { locale: "es", strength: 1 }; // “Dermatología” == “dermatologia”

export function getTurnosFiltrados() {
    return async (req: Request, res: Response) => {
        console.log('Solicitando turnos...', req.query)


        // Se obtienen los datos desde la query. El frontend usa nombres como
        // especialidadSeleccionada, ubicacionSeleccionada y medicoSeleccionado.
        // Aceptamos ambos conjuntos de nombres para compatibilidad.
        const q = req.query as Record<string, string | undefined>;
        const especialidad = q.especialidad;
        const localidad = q.localidad
        const prestador = q.prestador;
        const desde = q.desde; // opcional: ISO date string o timestamp

        // Se verifica que existan especialidad y localidad
        if (!especialidad || !localidad) {
            return res.status(400).json({ error: "Faltan especialidad y/o localidad" });
        }
        // Filtro base
        const filter: any = {
            disponible: true,
            especialidad, // igualdad sensible a collation
            localidad,
        };

        // Si viene prestador y NO es “todos”/“-”, lo agregamos
        if (prestador && prestador !== "" && prestador !== "-") {
            filter.prestador = prestador;
        }

        // Si se indicó 'desde' (fecha mínima) intentamos parsearla y filtrar
        if (desde) {
            const parsed = new Date(desde);
            if (!Number.isNaN(parsed.getTime())) {
                // asumimos que el campo en DB es `fechaTurno`
                filter.fechaTurno = { $gte: parsed };
            }
            // si no se pudo parsear, ignoramos 'desde' (no fallamos la petición)
        }

        // Proyección y orden
        const projection = { _id: 0 }; // no devolvemos _id
        const sort: any = { fechaTurno: 1 };

        // Como `turnosCol` es un arreglo en memoria, aplicamos el filtrado/ordenado en JS.
        const desdeGte = (filter.fechaTurno && (filter.fechaTurno as any).$gte) as Date | undefined;

        const equals = (a: string | undefined, b: string | undefined) =>
            typeof a === "string" && typeof b === "string"
                ? a.localeCompare(b, "es", { sensitivity: "base" }) === 0
                : false;

        const results = turnosCol
            .filter(t => {
                if (filter.disponible !== undefined && t.disponible !== filter.disponible) return false;
                if (!equals(t.especialidad, filter.especialidad)) return false;
                if (!equals(t.localidad, filter.localidad)) return false;
                if (filter.prestador) {
                    if (!equals(t.prestador ?? undefined, filter.prestador)) return false;
                }
                if (desdeGte && t.fechaTurno < desdeGte) return false;
                return true;
            })
            .sort((a, b) => a.fechaTurno.getTime() - b.fechaTurno.getTime())
            .slice(0, 200) // ajustá a tu paginación
            .map(t => {
                const { _id, ...rest } = t as any;
                return { ...rest, fechaTurno: t.fechaTurno }; // Express serializará Date a ISO
            });
            console.log(
                `La respuesta es:`, 
                results || [])
        res.json(results);
    };
}
