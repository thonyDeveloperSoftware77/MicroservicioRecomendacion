import express, { Application } from "express";
import cors from 'cors';
import usuarioRouter from "../ROUTES/recomendacionRouter"
import { getFirestore } from "firebase/firestore";

class Server{
    private app: Application;
    private port: string;
    private apiPaths = {
        recomendacion: '/api/recomendacion',
        //Paths para la aplicacion
    }
   

    constructor() { 
        this.app = express();
        this.port = process.env.PORT || '8000';
        //Metodos iniciales
        //Middlewares
        this.middlewares();
        //Definicion de las rutas
        this.routes();
    }
    middlewares() {
        
        //CORS
        this.app.use(cors({
            origin: [
                'https://web-auditoria-neon.vercel.app',
                'https://web-auditoria-git-main-auditoriainternaecuador.vercel.app',
                'https://web-auditoria-auditoriainternaecuador.vercel.app',
                //Añade local host
                'http://localhost:3001',
                'http://localhost:3001',
                //Añade todo
                '*'
            ]
            
        }));
        //Lectura del body
        this.app.use(express.json());
        //Carpeta publica
        this.app.use(express.static('public'));
    }


    routes() {
        //Implementacion de las rutas
        this.app.use(this.apiPaths.recomendacion, /*this.authMiddleware.bind(this),*/ usuarioRouter);
    }

    //prueba de conexion


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

export default Server;