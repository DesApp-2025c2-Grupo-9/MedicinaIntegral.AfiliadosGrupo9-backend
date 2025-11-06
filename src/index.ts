import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConnect';
import mongoose from 'mongoose';
import authRoutes from './routes/api/auth.routes';
import reintegrosRoutes from './routes/reintegros.routes';
import autorizacionesRoutes from './routes/autorizaciones.routes';
import recetasRoutes from './routes/recetas.routes';
import especialidadesRoutes from './routes/especialidades.routes';
import prestadoresRoutes from './routes/prestadores.routes';
import dashboard from './routes/dashboard.routes';
import corsOptions from './config/corsOptions';
import cookieParser from 'cookie-parser';
import { verifyJWT } from './middlewares/verifyJWT';
import afiliadosRoutes from './routes/afiliados.routes';
import { manejoDeErroresGlobales } from './middlewares/genericMiddleware';
import miCuentaRoutes from './routes/miCuenta.routes';
import enumsRoutes from './routes/enums.route';

export const app = express();
export const PORT = process.env.PORT || 3000;

// Conectar base de datos
connectDatabase();

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api', especialidadesRoutes);

// Verificamos JWT
app.use(verifyJWT);

// Rutas protegidas

/* app.use('/api', afiliadosRoutes);
app.use('/api', autorizacionesRoutes);
app.use('/api', reintegrosRoutes);
app.use('/api', recetasRoutes);
app.use('/api', especialidadesRoutes); */

app.use('/api', miCuentaRoutes);
app.use('/api', afiliadosRoutes);
app.use('/api', autorizacionesRoutes);
app.use('/api', reintegrosRoutes);
app.use('/api', recetasRoutes);
app.use('/api', especialidadesRoutes);
app.use('/api', prestadoresRoutes);
app.use('/api/enums', enumsRoutes);
app.use('/api', dashboard);

//Middleware global
app.use(manejoDeErroresGlobales);

// Escuchar puerto
mongoose.connection.once('open', () => {
  console.log('Conectado exitosamente a MongoDB');
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}...`);
  });
});
