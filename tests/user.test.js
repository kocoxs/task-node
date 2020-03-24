const request = require('supertest')
const app = require('../src/app.js')
const User = require('../src/models/user.js')
const {userOneId, userOne, setUpDB } = require('./fixtures/db.js')

beforeEach(setUpDB)

afterEach(()=>{
    console.log('afterEach')
})

test('deberia crear un usuario', async ()=> {
    const respuesta = await request(app).post('/user').send({
        name: 'Aaron Contreras',
        email: 'aaroncontreras1990@gmail.com',
        password: 'misuperclave'
    }).expect(201)
   
    const usuario = await User.findById(respuesta.body.user._id)

    expect(usuario).not.toBeNull()

    expect(respuesta.body).toMatchObject({
        user: {
            name: 'Aaron Contreras',
            email: 'aaroncontreras1990@gmail.com',
        },
        token: usuario.tokens[0].token
    })

    expect(usuario.password).not.toBe('misuperclave')
})

test('haciendo login', async () =>{
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const usuarioConsultado = await User.findById(response.body.user._id)
    
    expect(response.body.token).toBe(usuarioConsultado.tokens[1].token)
})

test('No debe logear usuarios que que tengan mal los datos', async () => {
    await request(app).post('/user/login').send({
        email: 'anything@anything.com',
        password: 'password'
    }).expect(400)
})

test('obtener el perfil del usuario', async () => {
    await request(app)
    .get('/user/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({})
    .expect(200)
})

test('no obtener el perfil si no esta autenticado', async () => {
    await request(app)
    .get('/user/me')
    .send({})
    .expect(401)
})

test('elimina el usuario autenticado', async () => {
    const response = await request(app)
    .delete('/user/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({})
    .expect(200)

    const usuarioElimnado = await User.findById(response.body._id)

    expect(usuarioElimnado).toBeNull()
})

test('elimina el usuario no autenticado mostrar el error', async () => {
    await request(app)
    .delete('/user/me/')
    .send({})
    .expect(401)
})

test('deberia cargar un avatar para los usuarios', async () => {
    await request(app)
        .post('/user/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)

    const usuario = await User.findById(userOneId)

    expect(usuario.avatar).toEqual(expect.any(Buffer))
})

test('actualizar los datos del usuario', async () => {
    const respuesta = await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Stephen',
            email: 'elotrocorreo@gmail.com'
        }).expect(200)
    const usuario = await User.findById(userOneId) 

    expect(usuario).not.toMatchObject(userOne)
    expect(usuario).toMatchObject({
        name: 'Stephen',
        email: 'elotrocorreo@gmail.com'
    })
})

test('no debe actualizar los datos que no existen', async () => {
    const respuesta = await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            segundoNombre: 'Stephen',
            correo: 'elotrocorreo@gmail.com'
        }).expect(400)
    
})