const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_PATH,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})