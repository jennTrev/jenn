import app from "./app.js"; 
import { bd } from "../src/database/database.js";

let isConnected = false;

async function connectDB() {
    if (!isConnected) {
        try {
            await bd.authenticate(); // Verifica conexión
            console.log("✅ Base de datos conectada correctamente");

            await bd.sync(); // Sincroniza modelos: crea tablas si no existen
            console.log("✅ Tablas sincronizadas correctamente");

            isConnected = true;
        } catch (error) {
            console.error("❌ Error al conectar o sincronizar con la base de datos:", error);
            process.exit(1);
        }
    }
}

async function startServer() {
    await connectDB(); // Conecta y sincroniza BD antes de levantar el servidor

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("erver está levantado en http://localhost:${PORT}");
    });
}

startServer();