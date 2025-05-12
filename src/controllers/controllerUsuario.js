import { usuario } from "../models/usuarios.js"
import Pusher from "pusher"

// Configuración de Pusher
const pusher = new Pusher({
  appId: "1978430",
  key: "4f85ef5c792df94cebc9",
  secret: "351840445857a008668f",
  cluster: "us2",
  useTLS: true,
})

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuario.findAll()
    const formatoUsuarios = usuarios.map((usuario) => {
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        user: usuario.user,
        correo: usuario.correo,
        rol: usuario.rol,
        contrasena: usuario.contrasena,
        altura: usuario.altura,
        posicion: usuario.posicion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        carrera: usuario.carrera, // Añadir carrera
      }
    })
    res.status(200).json(formatoUsuarios)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al obtener los usuarios" })
  }
}

// Obtener un solo usuario
export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const unUsuario = await usuario.findOne({ where: { id } })

    if (!unUsuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const formatoUsuario = {
      id: unUsuario.id,
      nombre: unUsuario.nombre,
      apellido: unUsuario.apellido,
      user: unUsuario.user,
      correo: unUsuario.correo,
      rol: unUsuario.rol,
      contrasena: unUsuario.contrasena,
      altura: unUsuario.altura,
      posicion: unUsuario.posicion,
      fecha_nacimiento: unUsuario.fecha_nacimiento,
      carrera: unUsuario.carrera, // Añadir carrera
    }

    res.status(200).json(formatoUsuario)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al obtener el usuario" })
  }
}

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, user, contrasena, rol, correo, altura, posicion, fecha_nacimiento, carrera } = req.body

    // Si el rol es 'entrenador' o 'tecnico', no enviar 'carrera'
    if (rol === "entrenador" || rol === "tecnico") {
      const nuevoUsuario = await usuario.create({
        nombre,
        apellido,
        user,
        contrasena,
        rol,
        correo,
      })
      res.status(201).json(nuevoUsuario)
    } else if (rol === "jugador") {
      // Si el rol es 'jugador', se envían todos los campos
      const nuevoUsuario = await usuario.create({
        nombre,
        apellido,
        user,
        contrasena,
        rol,
        correo,
        altura,
        posicion,
        fecha_nacimiento,
        carrera, // Solo si es jugador, incluir carrera
      })
      res.status(201).json(nuevoUsuario)
    } else {
      res.status(400).json({ message: "Rol no válido" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al crear el usuario" })
  }
}

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, user, contrasena, rol, correo, altura, posicion, fecha_nacimiento, carrera } = req.body

    const usuarioExistente = await usuario.findByPk(id)

    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    usuarioExistente.nombre = nombre
    usuarioExistente.apellido = apellido
    usuarioExistente.user = user
    usuarioExistente.contrasena = contrasena
    usuarioExistente.rol = rol
    usuarioExistente.correo = correo

    // Si el rol es 'jugador', se actualizan los campos adicionales, incluyendo carrera
    if (rol === "jugador") {
      usuarioExistente.altura = altura
      usuarioExistente.posicion = posicion
      usuarioExistente.fecha_nacimiento = fecha_nacimiento
      usuarioExistente.carrera = carrera // Solo si es jugador, actualizar carrera
    }

    await usuarioExistente.save()

    res.status(200).json(usuarioExistente)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al actualizar el usuario" })
  }
}

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const usuarioExistente = await usuario.findByPk(id)

    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    await usuarioExistente.destroy()
    res.status(200).json({ message: "Usuario eliminado exitosamente" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al eliminar el usuario" })
  }
}

// NUEVA FUNCIONALIDAD: Enviar comando a ESP32 a través de Pusher
export const enviarComandoESP32 = async (req, res) => {
  try {
    const { comando, userId } = req.body

    if (!comando) {
      return res.status(400).json({ message: "El comando es requerido" })
    }

    // Enviar el comando a través de Pusher
    await pusher.trigger("wsjenn", "command", {
      message: comando,
      userId: userId || "sistema",
      timestamp: new Date().toISOString(),
    })

    // Registrar el comando en la consola del servidor
    console.log(`Comando enviado a ESP32: ${comando} por usuario ID: ${userId || "sistema"}`)

    // Responder al cliente
    res.status(200).json({
      success: true,
      message: `Comando "${comando}" enviado exitosamente`,
    })
  } catch (error) {
    console.error("Error al enviar comando a ESP32:", error)
    res.status(500).json({
      success: false,
      message: "Error al enviar comando a ESP32",
      error: error.message,
    })
  }
}

// Obtener estado de conexión con Pusher
export const getPusherStatus = async (req, res) => {
  try {
    // Verificar la conexión con Pusher
    const status = await pusher.trigger("wsjenn", "status-check", {
      timestamp: new Date().toISOString(),
    })

    res.status(200).json({
      connected: true,
      message: "Conexión con Pusher establecida correctamente",
    })
  } catch (error) {
    console.error("Error al verificar conexión con Pusher:", error)
    res.status(500).json({
      connected: false,
      message: "Error al verificar conexión con Pusher",
      error: error.message,
    })
  }
}
