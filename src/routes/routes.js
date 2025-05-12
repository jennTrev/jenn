import { Router } from "express";
import { createUsuario, deleteUsuario, getUsuario, getUsuarios, updateUsuario } from "../controllers/controllerUsuario.js";

import { login } from "../controllers/authController.js";

const router = Router();


//LOGIN
//asdasdasd

router.post('/login', login);


router.get("/usuarios",getUsuarios);
router.get("/usuarios/:id", getUsuario);
router.post("/usuarios", createUsuario);
router.put("/usuarios/:id", updateUsuario );
router.delete("/usuarios/:id",deleteUsuario);
// Nuevas rutas para Pusher/ESP32
router.post("/esp32/comando", enviarComandoESP32)
router.get("/esp32/status", getPusherStatus)
export default router;