import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConnect';
import mongoose from 'mongoose';
import reintegrosRoutes from './routes/reintegros.routes';
import autorizacionesRoutes from './routes/autorizaciones.routes';
import recetasRoutes from './routes/recetas.routes';
import especialidadesRoutes from './routes/especialidades.routes';
import corsOptions from './config/corsOptions';

export const app = express();
export const PORT = process.env.PORT || 3000;

// Conectar base de datos
connectDatabase();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api', autorizacionesRoutes);
app.use('/api', reintegrosRoutes);
app.use('/api', recetasRoutes);
app.use('/api', especialidadesRoutes);

// Escuchar puerto
mongoose.connection.once('open', () => {
  console.log('Conectado exitosamente a MongoDB');
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}...`);
  });
});
