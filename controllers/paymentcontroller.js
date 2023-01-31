import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { usermodel } from "../models/user.js"
import { instance } from "../server.js"
import ErrorHandling from "../utils/errorHandling.js"
import crypto from "crypto"
import { Payment } from "../models/paymentmodel.js"
export const getsubscribed=catchAsyncError(async(req,res,next)=>{
 const user=await usermodel.findById(req.user._id)
    
 if(user.role==="admin" ) return next(new ErrorHandling
    ("Admin Cannot do these action",400))

  const planId=process.env.RAZOR_PAY_PLANID || "plan_KTh2yRiehAatl3" 

const subscription= await instance.subscriptions.create({
    plan_id:planId,
    customer_notify: 1,
    total_count: 12,
})
user.subscription.id=subscription.id
user.subscription.status=subscription.status
await user.save()
res.status(200).json({
    success:true
    ,
    subscriptionid:subscription.id

})
})

export const paymentVerify=catchAsyncError(async(req,res,next)=>{
const {razorpay_payment_id,razorpay_subscription_id
  ,razorpay_signature}=req.body
    const user=await usermodel.findById(req.user._id)

  const subscription_id=user.subscription.id
  const generated_signature=crypto.createHmac("sha256",process.env.RAZOR_PAY_SECRET_KEY).
  update(razorpay_payment_id + "|" + subscription_id).digest("hex")

  const isauthenticate= generated_signature===razorpay_signature
  if(!isauthenticate) return res.redirect(`${process.env.LINK}/paymentfail`)

  await Payment.create({
    razorpay_payment_id,
    razorpay_subscription_id
  ,razorpay_signature
  })
  user.subscription.status="active"
  await user.save()
  res.redirect(`${process.env.FRONTENDURL}/paymentsuccess?reference=${razorpay_payment_id}`)

})

export const getrazorpaykey=catchAsyncError(async(req,res,next)=>{
  res.status(200).json({
    success:true,
    key:process.env.RAZOR_PAY_APIKEY
  })
})


// for cancle subscription

export const canclesubs=catchAsyncError(async(req,res,next)=>{
  const user=await usermodel.findById(req.user._id)
  const subscriptionid=user.subscription.id
  // let refund=false
  const payment=await Payment.findOne({razorpay_subscription_id:subscriptionid})
 

   await instance.subscriptions.cancel(subscriptionid)
  
  const gap=Date.now() - payment.createdate

  const validUpto=process.env.VALID_DAY * 24 * 60 * 60 * 1000
  if(gap<=validUpto){
    await instance.payments.refund(payment.razorpay_payment_id)
    await payment.remove()
user.subscription.id=undefined
user.subscription.status=undefined
res.status(200).json({
  message: "you have Refund will happen under 3 days"
})
}else{
      next(new ErrorHandling("You cannot apply for refund, its more than 7 days",400))
}
})