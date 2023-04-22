// const express = require('express')
const express = require('express')
const cookieParser = require('cookie-parser')
const usersRouter = require('./routes/users.router.js')
const productsRouter = require('./routes/productos.router.js')
const viewsRouter = require('./routes/views.router.js')
// const { uploader } = require('./utils.js')
// handlebars_______________________________________________________________
const handlebars = require('express-handlebars')
const { uploader } = require('./utils/multerConfig.js')
// socket io _______________________________________________________________
const { Server } = require('socket.io')
const { objConfig } = require('./config/config.js')

// socket io _______________________________________________________________
objConfig.connectDB()
// pedir token
const app = express()


const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/virtual' ,express.static(__dirname+'/public'))
app.use(cookieParser())

// handlebars_______________________________________________________________
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')
// handlebars_______________________________________________________________


app.use('/vista', viewsRouter)


// http://localhost:8080/api/usuarios
app.use('/api/usuarios',  usersRouter)

// http://localhost:8080/api/productos
app.use('/api/productos', productsRouter)

app.post('/single', uploader.single('myfile') ,(req, res)=>{
    res.status(200).json({
        mensaje: 'se a subido con éxito el archivo'
    })
})

app.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).send('Todo mal')
})

const httpServer = app.listen(PORT,err =>{
    if (err)  console.log(err)
    console.log(`Escuchando en el puerto: ${PORT}`)
})

// instanciando un socket server
const io = new Server(httpServer)

const messages = []
io.on('connection', socket => { 
    console.log('Nuevo cliente conectado')

    socket.on('message', objetoMensajeCliente => {
        console.log(objetoMensajeCliente)
        messages.push(objetoMensajeCliente)

        io.emit('messageLogs', messages)
    })

    // socket.on('disconnect')
    socket.on('authenticated', nombreUsuario=>{
        socket.broadcast.emit('newUserConnected',nombreUsuario);
    })
})


