const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model('task', taskSchema)

module.exports = Task

// const newTask = new Task({description: 'aprender a validar'})

// newTask
// .save()
// .then(user => {
//     console.log(user)
// })
// .catch(error => console.log("Error: ", error))