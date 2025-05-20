import { Router } from "express"
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  enviarComandoESP32,
  getPusherStatus,
} from "../controllers/usuarios.js"

const router = Router()

// Rutas existentes
router.get("/usuarios", getUsuarios)
router.get("/usuarios/:id", getUsuario)
router.post("/usuarios", createUsuario)
router.put("/usuarios/:id", updateUsuario)
router.delete("/usuarios/:id", deleteUsuario)

// Nuevas rutas para Pusher/ESP32
router.post("/esp32/comando", enviarComandoESP32)
router.get("/esp32/status", getPusherStatus)

export default router
