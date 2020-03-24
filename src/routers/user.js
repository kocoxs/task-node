const express = require("express")
const User = require('../models/user.js')
const authMiddleware = require("../middleware/auth.js")
const multer = require('multer')
const sharp = require('sharp')
const email = require('../emails/account.js')

const upload = multer({
    //dest:'avatar',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        
        if(file.originalname == ""){
            cb(new Error('debe ser subir un archivo'))
        }

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('debe ser un documento jpg/jpeg/png '))
        }

        cb(undefined, true)

    }
})
const router = new express.Router()

router.post('/user', async (req, res)=>{

    try {
        //console.log(req.body)
        const user = new User(req.body)
        await user.save()
        const token = await user.generateToken();
        email.sendWelcome(user.email, user.name)
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)        
    }

});

router.post('/user/login', async (req, res)=>{

    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User(req.body).findByCredentials({email, password})
        const token = await user.generateToken();

        res.send({user, token})

    } catch (error) {
        //console.log(error)
        res.status(400).send()        
    }

});

router.post('/user/logout',authMiddleware, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.send()

    } catch (error) {
        //console.log(error)
        res.status(500).send(error)
    }
})

router.post('/user/logout/all',authMiddleware, async (req, res) => {
    try {

        req.user.tokens = []
        
        await req.user.save();

        res.send()

    } catch (error) {
        //console.log(error)
        res.status(500).send(error)
    }
})

router.get('/user', async (req, res)=>{

    try {
        const users = await User.find({})  
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/user/me', authMiddleware, async (req, res)=>{
    res.send(req.user)
})

const errorHandler = (error, req, res, next) => {
    res.status(400).send({error: error.message})
}

router.post('/user/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()

    req.user.avatar = buffer
    
    await req.user.save()

    res.send(req.user)

}, errorHandler)

router.delete('/user/me/avatar', authMiddleware, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()

    res.send()
    
}, errorHandler)

router.get('/user/:id',async (req, res)=>{
    
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if(user){
            res.status(200).send(user)
        }else{
            res.status(404).send()
        }

    } catch (error) {
        res.status(500).send(error)
    }
   
    
})

router.patch('/user/me', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'No es valido actualizar esto'})
    }
    try {
        //const user = await User.findByIdAndUpdate(_id, req.body,{new: true, runValidators: true});
        // const user = await User.findById(_id)

        // if(!user){
        //     return res.status(404).send();
        // }

        updates.forEach( (field) => req.user[field] = req.body[field] )

        await req.user.save()

        res.send(req.user);
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.patch('/user/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'No es valido actualizar esto'})
    }

    const _id = req.params.id
    try {
        //const user = await User.findByIdAndUpdate(_id, req.body,{new: true, runValidators: true});
        const user = await User.findById(_id)

        if(!user){
            return res.status(404).send();
        }

        updates.forEach( (field) => user[field] = req.body[field] )

        await user.save()

        res.send(user);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/user/me/', authMiddleware, async (req, res) => {
    try {

        // const user  = await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     res.status(404).send()
        // }

        email.sendCancelacion(req.user.email, req.user.name);

        await req.user.remove()

        res.send(req.user)

    } catch (error) {
         res.status(500).send(error)
    }
})

router.delete('/user/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const user  = await User.findByIdAndDelete(_id)

        if(!user){
            res.status(404).send()
        }

        res.send(user)

    } catch (error) {
         res.status(500).send(error)
    }
})

router.get('/user/:id/avatar',async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar)
            throw new Error()

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

module.exports = router