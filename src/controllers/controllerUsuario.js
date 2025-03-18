import { usuario } from "../models/usuarios.js";
//ssdsads
// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuario.findAll();
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
                fecha_nacimiento: usuario.fecha_nacimiento
            };
        });
        res.status(200).json(formatoUsuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
};

// Obtener un solo usuario
export const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const unUsuario = await usuario.findOne({ where: { id } });

        if (!unUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
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
            fecha_nacimiento: unUsuario.fecha_nacimiento
        };

        res.status(200).json(formatoUsuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { nombre, apellido, user, contrasena, rol, correo, altura, posicion, fecha_nacimiento } = req.body;

        if (rol === 'entrenador' || rol === 'tecnico') {
            // Si el rol es entrenador o tecnico, solo se envían nombre, apellido, user, contrasena y correo
            const nuevoUsuario = await usuario.create({
                nombre,
                apellido,
                user,
                contrasena,
                rol,
                correo
            });
            res.status(201).json(nuevoUsuario);
        } else if (rol === 'jugador') {
            // Si el rol es jugador, se envían todos los campos
            const nuevoUsuario = await usuario.create({
                nombre,
                apellido,
                user,
                contrasena,
                rol,
                correo,
                altura,
                posicion,
                fecha_nacimiento
            });
            res.status(201).json(nuevoUsuario);
        } else {
            res.status(400).json({ message: 'Rol no válido' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, user, contrasena, rol, correo, altura, posicion, fecha_nacimiento } = req.body;

        const usuarioExistente = await usuario.findByPk(id);

        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuarioExistente.nombre = nombre;
        usuarioExistente.apellido = apellido;
        usuarioExistente.user = user;
        usuarioExistente.contrasena = contrasena;
        usuarioExistente.rol = rol;
        usuarioExistente.correo = correo;

        // Solo se actualizan los campos extras si el rol es jugador
        if (rol === 'jugador') {
            usuarioExistente.altura = altura;
            usuarioExistente.posicion = posicion;
            usuarioExistente.fecha_nacimiento = fecha_nacimiento;
        }

        await usuarioExistente.save();

        res.status(200).json(usuarioExistente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioExistente = await usuario.findByPk(id);

        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuarioExistente.destroy();
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
