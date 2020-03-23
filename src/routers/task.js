const express = require("express")
const Task = require('../models/task.js')
const authMiddleware = require("../middleware/auth.js")

const router = new express.Router()

router.post('/task', authMiddleware, async (req, res)=>{
    
    console.log(req.body)

    try {
        const task = new Task({
            ...req.body,
            owner:req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

});
// GEt /task?complete=true
// GEt /task?limit=10
// GEt /task?sortBy=10
router.get('/task', authMiddleware, async (req, res)=>{
    try {
        //const response = await Task.find({owner: req.user._id})
        //const completed = req.query.completed || true;

        const match = { }
        const sort = {}

        if(req.query.completed)
            match.completed = req.query.completed === 'true' ;

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
        }

        await req.user.populate({
            path: 'task',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        const task = req.user.task

        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// router.get('/task', async (req, res)=>{
//     try {
//         const response = await Task.find({})
//         res.status(200).send(response)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

router.get('/task/:id', authMiddleware, async (req, res)=>{
    const _id = req.params.id

    try {
        const task =  await Task.findOne({_id, owner: req.user._id})

        //await req.user.populate('task').execPopulate()
        //const task = req.user.task
        if(task){
            res.status(200).send(task)
        }else{
            res.status(404).send()
        }
    } catch (error) {
        res.status(500).send(error)   
    }
})

// router.get('/task/:id',async (req, res)=>{
//     const _id = req.params.id

//     try {
//         const task =  await Task.findById(_id)
//         if(task){
//             res.status(200).send(task)
//         }else{
//             res.status(404).send()
//         }
//     } catch (error) {
//         res.status(500).send(error)   
//     }
// })

router.patch('/task/:id', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'No es valido actualizar esto'})
    }

    try {
        const _id = req.params.id
        //const task = await Task.findByIdAndUpdate(_id, req.body,{new: true, runValidators: true});
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((field)=>{
            task[field] = req.body[field]
        })

        await task.save()

        res.send(task);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/task/:id', authMiddleware, async (req, res) => {
    try {
        const _id = req.params.id
        const task  = await Task.findOne({_id, owner: req.user._id})

        if(!task){
            res.status(404).send()
        }
         
        await task.remove()

        res.send(task)

    } catch (error) {
         res.status(500).send(error)
    }
})

module.exports = router;