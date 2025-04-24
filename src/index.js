import app from "./app.js"; 
import { bd } from "../src/database/database.js";

let isConnected = false;

async function connectDB() {
    if (!isConnected) {
        try {
            await bd.authenticate(); // Solo autenticación, sin sobrescribir BD
            console.log("✅ Base de datos conectada correctamente");
            isConnected = true;
        } catch (error) {
            console.error("❌ Error al conectar con la base de datos:", error);
            process.exit(1); // Sale del proceso si no se puede conectar
        }
    }
}

async function startServer() {
    await connectDB(); // Primero se conecta la BD
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log("Server está levantado en http://localhost:3000");
    });
}

startServer();