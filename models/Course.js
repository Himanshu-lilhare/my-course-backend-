import mongoose  from "mongoose";
const courseschema=new mongoose.Schema({
title:{
    type:String,
    required:[true,"please enter the title"],
    minlength:[4,"title must be high than 4 characters"],
    maxlength:[80,"title must under 80 characters"],
    },
description:{
    type:String,
    required:[true,"please enter the title"],
    minlength:[30,"title must be high than 30 characters"],
    },
    lectures:[
        {
            title:{
                type:String,
                required:[true,"Please enter lecture title"],
                  },
             description:{
                type:String,
               required:[true,"please enter lecture description"]
             },
             video:{
                public_id:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                }
             }
              
        }
    ],
    category:{
        type:String,
        required:true
     },
     createdate:{
        type:Date,
        default:Date.now
    },
    createdby:{
       type:String,
       required:[true,"enter creator name"]
    },
    noOfVideos:{
       type:Number,
       default:0
    },
    views:{
       type:Number,
       default:0
    },
    poster:{
       public_id:{
           type:String,
           required:true
       },
       url:{
           type:String,
           required:true
       }
    } 

})
export const Course= mongoose.model("course",courseschema)