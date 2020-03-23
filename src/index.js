const express = require('express')

require('./db/mongoose.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log("Servidor esta corriendo")
})

// const errorMiddleware = (req, res, next) => {
//     throw new Error('Error desde el middleware')
// }
// const errorHandler = (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// }

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, errorHandler)


// app.use((req, res, next) => {
//     console.log("**-*-*-*-***-*-*-*-*-*-*AQUI**-*-*-*-***-*-*-*-*-*-*")
//     console.log(req.method, req.path)

//     if(req.method === 'GET'){
//         res.send('Gets estan deshabilitados')
//     }else{
//         next()
//     }

// })

// app.use((req, res, next) => {
//     res.status(503).send('En Mantenimiento')   
// })

// const Task = require('./models/task.js')
// const User = require('./models/user.js')

// const prueba = async () => {
//     const task = await Task.findById('5e778048b9050a224b94d40e')
//     await task.populate('owner').execPopulate()
//     //console.log(task.owner)

//     const user = await User.findById('5e777fa2912e032100687244')
//     await user.populate('task').execPopulate()
//     console.log("las tareas del usuario")
//     console.log(user.task) 
// }

// prueba()

// const jwt = require("jsonwebtoken")

// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'thisismykey', {expiresIn: '7 days'})
//     console.log("----------")
//     console.log(token)
//     console.log("----------")

//     const result = jwt.verify(token, 'thisismykey')

//     console.log(result)
//     console.log("----------")
// }

// myFunction()