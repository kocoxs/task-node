const { MongoClient, ObjectID } = require('mongodb')
const conectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

MongoClient.connect(conectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error){
        return console.log("Ocurrio un error: ", error)
    }

    console.log('Conectado a mongo')

    const db = client.db(database)

    db.collection('users')
    .deleteMany({age:29})
    .then(result => {
        console.log("Exito")
    })
    .catch(error => console.log("Error: ", error))

    // db.collection('task').updateMany(
    //     {},
    //     {
    //         $set: { completed: true}
    //     }
    // ).then(result => {
    //     console.log("Exito")
    // })
    // .catch(error => console.log("Error: ", error))

    // db.collection('users').updateOne(
    //     { _id : new ObjectID("5e73c16291c5b6648d1e3dee") },
    //     {
    //         $inc: {age: 100 }
    //     }
    // ).then((response)=>{
    //     console.log(response)
    // })
    // .catch(error => console.log("Error: ", error))

    // db.collection('users').updateOne(
    //     { _id : new ObjectID("5e73c16291c5b6648d1e3dee") },
    //     {
    //         $set: {name: 'Esteban' }
    //     }
    // ).then((response)=>{
    //     console.log(response)
    // })
    // .catch(error => console.log("Error: ", error))

    // db.collection('users').insertOne({
    //     name: 'Aaron',
    //     age: 29
    // }).then((error, result)=>{
    //     if(error){
    //         return console.log("No se pudo insertar")
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Camilo',
    //         age: 51
    //     },
    //     {
    //         name: 'Mireya',
    //         age: 55
    //     }
    // ]).then((result) => {
    //     console.log("SUccess: ", result.ops)
    // }).catch(error => console.log('Error:', error));


    // db.collection('task').insertMany([
    //     {
    //         description: 'learn react',
    //         completed: false
    //     },
    //     {
    //         description: 'aprender redux',
    //         completed: true
    //     }
    // ]).then((result) => {
    //     console.log("Success: ", result.ops)
    // }).catch(error => console.log('Error:', error));

    // db.collection('task').findOne({_id: new ObjectID("5e73c775579d47696064fe22")})
    // .then((result)=>{
    //     console.log("la tarea finalizada es: ")
    //     if(result == null)
    //         return console.log("no hay datos")
    //     console.log(result)
    // })
    // .catch((err) => console.log("ERROR: ,", err))

    // db.collection('users')
    // .find({age:51})
    // .toArray()
    // .then((data)=>{
    //     console.log("FIND: ")
    //     console.log(data);
    // })
})