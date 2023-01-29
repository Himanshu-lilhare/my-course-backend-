import { usermodel } from "../models/user.js";
import ErrorHandling from "../utils/errorHandling.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const subscriberOrNot=catchAsyncError(async(req,res,next)=>{
    const user=await usermodel.findById(req.user._id)

    if(user.subscription.status==="active" || user.role==="admin"){
        next()
    }
    else(
        next(new ErrorHandling("Onlu subscribers and admin can access these lectures"))
    )
})