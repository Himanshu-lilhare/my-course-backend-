import ErrorHandling from "../utils/errorHandling.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken"
import { usermodel } from "../models/user.js";
export const getaccessafterlogin=catchAsyncError(async(req,res,next)=>{

    const {token}=req.cookies

    if(token==="j:null" || !token) return next(new ErrorHandling("you are not Logged In "),400)
     
   
  
    const decode=jwt.verify(token,process.env.TOKENKEY)
   
    // these decode is object which holds he id 

    req.user=await usermodel.findById(decode._id)
   console.log("it is going next")
     next()
})

export const adminORuser=(req,res,next)=>{
if(req.user.role==="admin" ){
    next()
}
else{
 return   next(new ErrorHandling("only admin and subscriber can access this page ",400))
}

}