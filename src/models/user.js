const mongoose = require('mongoose')
const validator = require('validator')
const bycript = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require('./task.js')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim:true,
        validate (value) {
            if(!value || value === "")
                throw new Error("el nombre no puede ser nulo")
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error("edad no puede ser negativa")
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('No es correo')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate (data) {
            if(new RegExp(/password/, 'i').exec(data)){
                throw new Error('el password no puede ser password')
            }
        }
        
    },
    tokens: [{
        token:{
            type: String,
            require: true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('task', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.findByCredentials = async ({email, password}) => {
    const user = await User.findOne({email})

    if(!user)
        throw new Error ("No se puede conectar 1")

    const esValido =  await bycript.compare(password, user.password)

    if(!esValido)
        throw new Error ("No se puede conectar 2")

    return user;
}

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})

    await user.save()

    return token
}

//match al guardar passwrod
userSchema.pre('save', async function (next){
    const user =  this

    console.log('antes de salvar aqui')
    if(user.isModified('password')){
        console.log('antes de salvar aqui 2')
        console.log(user.password)
        user.password = await bycript.hash(user.password, 8)
        console.log(user.password)
    }

    next()
})

userSchema.pre('remove', async function (next){
    const user =  this

    console.log('antes de eliminar')
    
    await Task.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User



// const me = new User({
//     name:'Aaron Contreras   ', 
//     email: ' aarosdsdASas@gmail.com  ',
//     password: ' passwor2d '
// })

// me.save()
// .then(user => {
//     console.log(user)
// })
// .catch(error => console.log("Error: ", error))