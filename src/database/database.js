import { Sequelize } from 'sequelize';

// Determinar si estamos en Render o en otro entorno
const isRender = process.env.RENDER || false;
const DATABASE_URL = isRender
  ? "postgresql://vol_3ym1_user:G1Ij3jmF1vbEmIVX7X80Rsr9tBTGzgyp@dpg-cvccn0lds78s73ahnjog-a/vol_3ym1" // Internal URL
  : "postgresql://vol_3ym1_user:G1Ij3jmF1vbEmIVX7X80Rsr9tBTGzgyp@dpg-cvccn0lds78s73ahnjog-a.oregon-postgres.render.com/vol_3ym1"; // External URL

// Evitar múltiples conexiones en AWS Lambda
let sequelize;

if (!global.sequelize) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Requerido para conexiones seguras
        rejectUnauthorized: false, // Permitir certificados auto-firmados en AWS y Render
      },
    },
    logging: false, // Desactiva logs de SQL en producción
  });

  global.sequelize = sequelize;
} else {
  sequelize = global.sequelize;
}

// Verificar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
})();

export { sequelize as bd };
