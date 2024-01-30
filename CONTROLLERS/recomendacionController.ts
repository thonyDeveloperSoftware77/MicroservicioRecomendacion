import { request, Response } from "express";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import db from "../SERVICE/Context/firebase";
import * as redis from 'redis';
import "./subscriber";
import { publisher, redisSubscriber } from "../app";



export const getRecomendacion = async (req = request, res: Response) => {

    try {
        const id = req.params.id;
        const usuario = await getUsuario(id);
        //Peliculas favoritas
        const favoritos = usuario?._favoritos;
        let peliculas: any[];
        let generosPreferidos = [];
        peliculas = [];
        // Crear un objeto para llevar el recuento de los IDs de los géneros
        let conteoGeneros: any;
        conteoGeneros = {};

        //Obtener las peliculas de la lista de favoritos
        if (favoritos.length > 4) {
            for (let i = 0; i < favoritos.length; i++) {
                const pelicula = await getPelicula(favoritos[i]._id);
                peliculas.push(pelicula);
            }
            peliculas.map((pelicula: any) => {
                pelicula.genres.map((genero: any) => {
                    let idGenero = genero.id;

                    // Si el ID del género ya existe en el objeto, incrementar su conteo
                    if (conteoGeneros[idGenero]) {
                        conteoGeneros[idGenero]++;
                    }
                    // Si no, agregarlo al objeto con un conteo de 1
                    else {
                        conteoGeneros[idGenero] = 1;
                    }
                })
            })

            // Buscar en el objeto todos los IDs de género que se repitan al menos dos veces
            for (let idGenero in conteoGeneros) {
                if (conteoGeneros[idGenero] >= 2) {
                    generosPreferidos.push(idGenero);
                }
            }
        }

        // Crear un objeto para almacenar las películas recomendadas
        let peliculasRecomendadas: any;
        peliculasRecomendadas = {};

        // Buscar películas por género
        for (let i = 0; i < generosPreferidos.length; i++) {
            let peliculasPorGenero = await buscarPeliculasPorGenero(generosPreferidos[i]);

            // Asegurarse de que no se repitan las películas y limitar a 5 por género
            let contador = 0;
            for (let j = 0; j < peliculasPorGenero.length; j++) {
                if (!peliculasRecomendadas[peliculasPorGenero[j].id] && contador < 5) {
                    peliculasRecomendadas[peliculasPorGenero[j].id] = peliculasPorGenero[j];
                    contador++;
                }
            }
        }

        // Convertir el objeto a un array para la respuesta
        let respuesta = Object.values(peliculasRecomendadas);
        let notificacion : any[]
        notificacion = []

        respuesta.map((pelicula:any)=>{
            notificacion.push({
                "title": pelicula.title,
                "Overview": pelicula.overview,
            })
        })

        let notificacionString = {
            correo: usuario?._email,
            mensaje: notificacion
        }

        publisher.publish('recommendations', JSON.stringify(notificacionString));
        
        res.json(respuesta);
    } catch (error) {
        res.json(error);
    }
}


export const buscarPeliculasPorGenero = async (idGenero: string) => {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${idGenero}&api_key=221a5887c176a30296b0e870ada5696c`, {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMjFhNTg4N2MxNzZhMzAyOTZiMGU4NzBhZGE1Njk2YyIsInN1YiI6IjY1YTVlNWYwZWI2NGYxMDEyOGY0ZTgzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OyadVEsT18O5fh26OgN1fVCrTQRsQh7zVgk0Aep30Zo',
            'accept': 'application/json'
        }
    })
    const data = await res.json();
    return data.results;
}

export async function getUsuario(id: string) {
    try {
      const usuario = await fetch(`http://localhost:8001/api/usuario/${id}`)
      .then((res) => res.json())
      .then((data) => data);
      return usuario;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export async function getPelicula(id: string) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=221a5887c176a30296b0e870ada5696c`, {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMjFhNTg4N2MxNzZhMzAyOTZiMGU4NzBhZGE1Njk2YyIsInN1YiI6IjY1YTVlNWYwZWI2NGYxMDEyOGY0ZTgzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OyadVEsT18O5fh26OgN1fVCrTQRsQh7zVgk0Aep30Zo',
            'accept': 'application/json'
        }
    })
    const data = await res.json();
    return data;
}

