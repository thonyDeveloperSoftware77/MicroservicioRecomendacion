import { json } from "stream/consumers";
import Server from "./SERVICE/server";
import * as redis from 'redis';

// Crear el cliente de Redis
export const publisher = redis.createClient();

// Crear el servidor
const server = new Server();

// Función para iniciar el servidor y el cliente de Redis
async function start() {
    try {
        // Conectar el cliente de Redis
        await publisher.connect();
        console.log('Conectado a Redis');
        console.log('Publicador conectado a Redis');
        // Iniciar el servidor
        server.listen();
    } catch (error) {
        console.error('Error al iniciar:', error);
    }
}

// Iniciar todo
start();

// redisSubscriber.js
export const redisSubscriber = redis.createClient();

async function connectSubscriber() {
    try {
        await redisSubscriber.connect();
        console.log('Suscriptor conectado a Redis');
    } catch (error) {
        console.error('Error al conectar el suscriptor a Redis:', error);
    }
}

connectSubscriber();

redisSubscriber.subscribe('recommendations', (message, channel) => {
    // Convertir el mensaje de cadena JSON a un objeto JavaScript

    console.log(`Received the following message from ${channel}: )`);
    console.log((message));

    const url = 'https://a0bfxuhxeh.execute-api.us-east-2.amazonaws.com/Test/envio_notificacion';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: (message),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Éxito:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});