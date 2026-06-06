const mongoose = require('mongoose')

const userCartSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true 
        },
        
    }
)