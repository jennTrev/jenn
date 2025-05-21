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

export default router
