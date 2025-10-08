import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConnect';
import mongoose from 'mongoose';
import reintegrosRoutes from './routes/reintegros.routes';
import { autorizacionesRoutes } from './routes';
import corsOptions from './config/corsOptions';

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar base de datos
connectDatabase();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/autorizaciones', autorizacionesRoutes);
//
// app.get('/', async (req, res) => {
//   return res.json({ message: 'Hola mundo.' });
// });

app.use('/api', reintegrosRoutes);

// Escuchar puerto
mongoose.connection.once('open', () => {
  console.log('Conectado exitosamente a MongoDB');
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}...`);
  });
});
