const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user.js')
const Task = require('../../src/models/task.js')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Aaron Contreras',
    email: 'coquitoaaron@gmail.com',
    password: 'misuperclave',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Stephen Arellano',
    email: 'coquitoaaron1@gmail.com',
    password: 'misuperclave',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'primera tarea',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'segunda tarea',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'tercera tarea',
    completed: true,
    owner: userTwoId
}

const setUpDB = async () => {

    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setUpDB,
    taskOne,
    taskTwo,
    taskThree
}