import app from "./app.js"; 
import { bd } from "../src/database/database.js";

let isConnected = false;

async function connectDB() {
    if (!isConnected) {
        try {
            await bd.authenticate(); // Usamos authenticate() en vez de sync() para evitar sobrescribir la BD
            console.log("✅ Base de datos conectada correctamente");
            isConnected = true;
        } catch (error) {
            console.error("❌ Error al conectar con la base de datos:", error);
        }
    }
}

async function main() {
    await connectDB(); // Conectar antes de iniciar el servidor
    app.listen(3000, () => {
        console.log("Server está levantado en http://localhost:3000");
    });
}
//asdasd
main();
