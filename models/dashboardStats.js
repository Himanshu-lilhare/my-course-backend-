import mongoose from "mongoose";

const statSchema=new mongoose.Schema({
    users:{
        type:Number,
        default:0
    },
    subscriptions:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
    createdate:{
        type:Date,
        default:Date.now
    }
})

export const statsModel= mongoose.model("stats",statSchema)