import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import connectDatabase from '../config/dbConnect';
import path from 'path';
import fs from 'fs';
import Reintegro from '../models/Reintegro';
import Afiliado from '../models/Afiliado';
import Receta from '../models/Receta';
import Autorizacion from '../models/Autorizacion';
import Prestadores from '../models/Prestador';
import Turno from '../models/Turno';

const seed = async () => {
  try {
    await connectDatabase();
    console.log('Conectado exitosamente a MongoDB');

    // Obtenemos las colecciones de la base de datos
    const db = mongoose.connection.db;
    if (!db) throw new Error('Error al obtener la base de datos.');
    const collections = await db.collections();

    // Vaciamos las colecciones de la base de datos
    for (let collection of collections) {
      console.log(`Vaciando la colección ${collection.collectionName}...`);
      await collection.deleteMany({});
    }
    console.log('Todas las colecciones han sido vaciadas.');

     //Obtenemos los prestadores del JSON prestadores.json
    const prestadoresFilePath = path.resolve('./src/json/prestadores.json');
    const prestadores = JSON.parse(fs.readFileSync(prestadoresFilePath, 'utf-8'));

    //Obtenemos los turnos del JSON turnos.json
    const turnosFilePath = path.resolve('./src/json/turnos.json');
    const turnos = JSON.parse(fs.readFileSync(turnosFilePath, 'utf-8'));

    //Obtenemos las autorizaciones del JSON autorizaciones.json
    const autorizacionesFilePath = path.resolve('./src/json/autorizaciones.json');
    const autorizaciones = JSON.parse(fs.readFileSync(autorizacionesFilePath, 'utf-8'));

    // Obtenemos las recetas del JSON recetas.json
    const recetasFilePath = path.resolve('./src/json/recetas.json');
    const recetas = JSON.parse(fs.readFileSync(recetasFilePath, 'utf-8'));

    // Obtenemos los reintegros del JSON reintegros.json
    const reintegrosfilePath = path.resolve('./src/json/reintegros.json');
    const reintegros = JSON.parse(fs.readFileSync(reintegrosfilePath, 'utf8'));

    // Obtenemos los afiliados del JSON afiliados.json
    const afiliadosfilePath = path.resolve('./src/json/afiliados.json');
    const afiliados = JSON.parse(fs.readFileSync(afiliadosfilePath, 'utf8'));

    // Insertamos los datos JSON en la base de datos
    await Prestadores.insertMany(prestadores);
    console.log('Seed de Prestadores completado.');
    await Turno.insertMany(turnos);
    console.log('Seed de Turnos completado.');

    await Reintegro.insertMany(reintegros);
    console.log('Seed de Reintegros completado.');
    await Afiliado.insertMany(afiliados);
    console.log('Seed de Afiliados completado.');

    await Autorizacion.insertMany(autorizaciones);
    console.log('Seed de autorizaciones Completado');
    await Receta.insertMany(recetas);
    console.log('Seed de Recetas Completado');

    console.log('El seed ha finalizado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Ha ocurrido un error al ejecutar el seed.', error);
    process.exit(1);
  }
};

seed();
