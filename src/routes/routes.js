import { Router } from "express"
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  enviarComandoESP32,
} from "../controllers/controllerUsuario.js"

import {
  getReacciones,
  getReaccion,
  createReaccion,
  updateReaccion,
  deleteReaccion,
} from "../controllers/reaccion.controller.js"

import {
  getAlfombras,
  getAlfombra,
  createAlfombra,
  updateAlfombra,
  deleteAlfombra,
} from "../controllers/alfombra.controller.js"
import { login  } from "../controllers/authController.js"

import { 
    obtenerPruebasUsuario, 
    obtenerEstadisticasUsuario 
} from '../controllers/pruebasController.js';
import { 
    rankingAlfombra, 
    rankingReaccion, 
    rankingGeneral, 
    compararUsuarios 
} from '../controllers/rankingController.js';

const router = Router()

// Rutas existentes
router.get("/usuarios", getUsuarios)
router.get("/usuarios/:id", getUsuario)
router.post("/usuarios", createUsuario)
router.put("/usuarios/:id", updateUsuario)
router.delete("/usuarios/:id", deleteUsuario)

router.get("/reacciones", getReacciones)
router.get("/reacciones/:id", getReaccion)
router.post("/reacciones", createReaccion)
router.put("/reacciones/:id", updateReaccion)
router.delete("/reacciones/:id", deleteReaccion)

router.get("/alfombras", getAlfombras)
router.get("/alfombras/:id", getAlfombra)
router.post("/alfombras", createAlfombra)
router.put("/alfombras/:id", updateAlfombra)
router.delete("/alfombras/:id", deleteAlfombra)

router.post("/login", login)
// Nuevas rutas para Pusher/ESP32
router.post("/esp32/comando", enviarComandoESP32)
// Rutas para pruebas individuales
router.get('/usuario/:userId/pruebas', obtenerPruebasUsuario);
router.get('/usuario/:userId/estadisticas', obtenerEstadisticasUsuario);

// Rutas para rankings
router.get('/ranking/alfombra', rankingAlfombra);
router.get('/ranking/reaccion', rankingReaccion);
router.get('/ranking/general', rankingGeneral);

// Ruta para comparar usuarios
router.get('/comparar/:userId1/:userId2', compararUsuarios);

export default router
