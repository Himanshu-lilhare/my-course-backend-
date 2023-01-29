import mongoose  from "mongoose";
const paymentschema=new mongoose.Schema({
    razorpay_payment_id:{
        type:String,
        require:true
    },razorpay_subscription_id:{
        type:String,
        require:true
    }
    ,razorpay_signature:{
        type:String,
        require:true
    }
     ,createdate:{
        type:Date,
        default:Date.now
    },
   

})
export const Payment= mongoose.model("payment",paymentschema)