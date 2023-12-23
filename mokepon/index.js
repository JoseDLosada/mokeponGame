/* Nuestro Código está hecho de la siguiente manera:

1.Importamos ExpressJS para usarlo en nuestro Proyecto
2.Creamos una Aplicación con ExpressJS
3.Le decimos a Express que cuando la URL raíz reciba una petición, responda "con el id del jugador"
4.Le decimos que escuche continuamente en el puerto 8080 las peticiones de los clientes para que todo el tiempo pueda responderles */
//Note: con ctrl + C apagamos el servidor

//importamos las librerias
const express = require('express')//Permite utilzar las librerias instaladas por npm
const cors = require('cors')

//Aplicación que actua como servidor para responder las peticiones
const app = express()// Variable para almacenar la aplicacion; invocar express como una funcion crea una extancia del servvidor que estamos usando
app.use(express.static('public'))
app.use(cors())//por medio del .use le decimos a express que use esta libreria
app.use(express.json())//habilitamos la capacidad de permitir petiones post en formato json


const jugadores = []//Lista de jugadores que van entrando

//Clase jugador crea al jugador con su id
class Jugador{
    constructor(id){
        this.id = id
    }
    asignarMokepon(mokepon){
        this.mokepon = mokepon
    }

    actualizarPosicion(x,y){
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques){
        this.ataques = ataques

    }
}

class Mokepon{
    constructor(nombre){
        this.nombre = nombre
    }
}


//endpoint
/* Crear una peticion por medio del "get", get es solicitar cada vez que un cliente solicite un recurso realiza algo , app.get funcion:
Parametros de entrada: "/" la entrada raiz del servidor
(req,res) requerimiento y respuesa. dentro de la Arrow Fuction */
app.get('/unirse', (req, res) =>{
    const id = `${Math.random()}` //sintaxis template string que el numero se vulva una cadena de texto, crea un id para cada jugador
    const jugador = new Jugador(id)// creamos el objeto de la clase jugador
    //res.setHeader('Access-Control-Allow-Origin','*')//Habilitar todos los origenes se puedan hacer peticiones al server; es inseguro solo ene este caso con el "*" -> cualquier origen es admitido

    //libreria para configurar la entrada del header con la libreria cors
    jugadores.push(jugador)
    res.send(id)
})

//petición tipo post para recibir peticiones tipo json
app.post('/mokepon/:jugadorId', (req, res) => { //variable de tipo parametro que viene de la URL al momento de recibir la petición, obtiene el id del jugador en este caso; Sintaxis ":jugadorId" forma de definir variables en express, establecemos el callback que va procesar la petición con el req y el res
    const jugadorId = req.params.jugadorId || "" //extramos la informacion de la peticion de la persona, por medio del req.params.jugadorId || "" vacio por si no llega el parametro 
    const nombre = req.body.mokepon || "" // extrae la informacion del cuerpo
    const mokepon = new Mokepon(nombre)//creamos el objeto mokepon de la clase Mokepon
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id ) //bucamos en la lista si se encuetra en id de jugador 
    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].asignarMokepon(mokepon) // si se encuentra dentro de la lista se le asigna el mokepon por medio del metodo asignarMokepon de la clase Mokepon
    }

    console.log(jugadores)//lista de jugadores
    console.log(jugadorId)//el id de los jugadores
    res.end()//terminar la petición
})

//endpoint para recibir la ubicacion del mokepon las cordenadas X y Y 
app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id ) 
    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].actualizarPosicion(x,y)
    }

    //filtrar los jugadores menos el actual
    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({ // solo puedes devoler un JSON
        enemigos
    })
})


app.post('/mokepon/:jugadorId/ataques', (req, res) => { 
    const jugadorId = req.params.jugadorId || "" 
    const ataques = req.body.ataques || [] 
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id ) 
    if (jugadorIndex >= 0){
        jugadores[jugadorIndex].asignarAtaques(ataques) 
    }
    res.end()
})

//.get  para solicitar datos, solicitar los ataques que se estan realizando
app.get('/mokepon/:jugadorId/ataques', (req, res) => {
    const jugadorId = req.params.jugadorId || "" 
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

//Necesitamos qeu escuhe las peticiones por medio de un puerto
/* Aparametros:
Puerto: 8080, por donde va estar escuchando las peticiones
arrow fuction */
app.listen(8080, () => {
    console.log('Servidor Funcionando')
}) //Usa uan arrow function, para el puerto y el callback


