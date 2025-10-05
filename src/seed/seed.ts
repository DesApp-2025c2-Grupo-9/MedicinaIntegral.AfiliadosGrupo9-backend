import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Afiliado from "../models/Afiliado";
import connectDB from "../config/dbConnect";
import { TipoDocumento } from "../enums/TipoDocumento";
import { Parentesco } from "../enums/Parentesco";
import { PlanMedico } from "../enums/PlanMedico";

const seed = async () => {
  try {
    await connectDB();

    console.log(" Conexión a MongoDB establecida");

    console.log("🗑 Eliminar datos previos");

    // Esperar a que la conexión esté lista
    await mongoose.connection.asPromise();

    const db = mongoose.connection.db;
    if (!db) throw new Error("No se pudo obtener la DB");

    const collections = await db.collections();

    for (let collection of collections) {
      console.log(`Borrando colección: ${collection.collectionName}`);
      await collection.deleteMany({});
    }

    console.log(" Insertar datos iniciales");

    const afiliados = await Afiliado.insertMany([
      {
        nroAfiliado: "000001-01",
        grupoFamiliar: "000001",
        nombre: "Juan",
        apellido: "Pérez",
        tipoDocumento: TipoDocumento.DNI,
        nroDocumento: "12345678",
        fechaNacimiento: new Date("1980-01-01"),
        email: "juan.perez@email.com",
        telefono: "123456789",
        direccion: "Calle Uno 123",
        parentesco: Parentesco.TITULAR,
        situacionTerapeutica: "Sin enfermedades preexistentes",
        planMedico: PlanMedico.PLAN_100,
      },
      {
        nroAfiliado: "000002-02",
        grupoFamiliar: "000002",
        nombre: "María",
        apellido: "Gómez",
        tipoDocumento: TipoDocumento.DNI,
        nroDocumento: "87654321",
        fechaNacimiento: new Date("1990-05-12"),
        email: "maria.gomez@email.com",
        telefono: "987654321",
        direccion: "Avenida Siempre Viva 742",
        parentesco: Parentesco.CONYUGE,
        situacionTerapeutica: "Sin enfermedades preexistentes",
        planMedico: PlanMedico.PLAN_200,
      },
      {
        nroAfiliado: "000003-03",
        grupoFamiliar: "000003",
        nombre: "Lucía",
        apellido: "Pérez",
        tipoDocumento: TipoDocumento.DNI,
        nroDocumento: "11223344",
        fechaNacimiento: new Date("2010-03-15"),
        email: "lucia.perez@email.com",
        telefono: "555555555",
        direccion: "Calle Argentina 123",
        parentesco: Parentesco.HIJO,
        situacionTerapeutica: "Alergia estacional",
        planMedico: PlanMedico.PLAN_100,
      },
    ]);

    console.log(` Afiliados creados: ${afiliados.length}`);
    console.log(" Seed completado");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
