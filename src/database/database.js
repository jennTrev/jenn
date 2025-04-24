import { Sequelize } from 'sequelize';

// Determinar si estamos en Render o en otro entorno
const isRender = process.env.RENDER || false;

const DATABASE_URL = isRender
  ? "postgresql://voley_user:OMpOzpaJG7yjk9hEtTTUxewVC4DlPnxS@dpg-d02n2rqdbo4c73f08e40-a/voley" // Internal URL
  : "postgresql://voley_user:OMpOzpaJG7yjk9hEtTTUxewVC4DlPnxS@dpg-d02n2rqdbo4c73f08e40-a.oregon-postgres.render.com/voley"; // External URL

// Evitar múltiples conexiones en AWS Lambda o entorno Serverless
let sequelize;

if (!global.sequelize) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
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