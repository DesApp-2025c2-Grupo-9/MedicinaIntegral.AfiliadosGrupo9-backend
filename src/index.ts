import dotenv from "dotenv";
import path from "path";

dotenv.config();

import express from "express";
import connectDatabase from "./config/dbConnect";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar base de datos
connectDatabase();

// Middlewares
app.use(express.json());

//
app.get("/", async (req, res) => {
  return res.json({ message: "Hola mundo." });
});

// Escuchar puerto
mongoose.connection.once("open", () => {
  console.log("Conectado exitosamente a MongoDB");
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}...`);
  });
});
