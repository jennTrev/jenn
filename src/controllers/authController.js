import { usuario } from '../models/usuarios.js';
import { Sequelize } from 'sequelize';

export const login = async (req, res) => {
  const { user, password } = req.body;  // solo user y password

  try {
    const userRecord = await usuario.findOne({
      where: {
        user: user,  // se usa solo el campo user
      },
    });
    //sddasd
//sas
    if (!userRecord) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Validación de contraseña
    if (userRecord.contrasena !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Respuesta exitosa (sin token ni correo)
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: userRecord.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
