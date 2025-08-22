import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'Hola mundo' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}...`);
});
