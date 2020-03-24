const request = require('supertest')
const app = require('../src/app.js')
const Task = require('../src/models/task.js')
const User = require('../src/models/user.js')
const {userOneId, userOne, setUpDB, taskOne, taskTwo, taskThree, userTwo } = require('./fixtures/db.js')

beforeEach(setUpDB)

test('crear una tarea', async () => {
    const response = await request(app)
        .post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'primer test de una tarea'
        })
        .expect(201)
    
    const task = await Task.findById(response.body._id)

    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('tareas del usuario 1', async () => {
    const response = await request(app)
        .get('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    await user.populate('task').execPopulate()

    expect(response.body.length).toBe(user.task.length)
})

test('Borrar los datos correctos que corresponden al usuario', async () => {
    const response = await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    
    const task = await Task.findById(taskOne._id)

    expect(task).not.toBeNull()
})