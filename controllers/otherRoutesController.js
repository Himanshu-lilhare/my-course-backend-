import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { statsModel } from "../models/dashboardStats.js"
import ErrorHandling from "../utils/errorHandling.js"
import { sendemail } from "../utils/sendemail.js"

export const contact=catchAsyncError(async(req,res,next)=>{
    const {name,email,message}=req.body

    if(!name || !email || !message) return next(new ErrorHandling("Please enter all field ",400))
const to="rajlilhare200@gmail.com"
const subject="these is from fitCODINGCAMP"
const text= `hi i am ${name}, my emial is ${email}
/n ${message}
`
   await sendemail(to,subject,text)

  res.status(200).json({
    message:"Sent successfully"
  })
})
export const requestcourse=catchAsyncError(async(req,res,next)=>{
      const {name,email,coursename}=req.body
    if(!name || !email || !coursename) return next(new ErrorHandling("Please enter all field ",400))

    const to=process.env.MY_EMAIL
const subject="these is from fitCODINGCAMP"
const text= `hi i am ${name}, my emial is ${email}
/n ${coursename}`

  await  sendemail(to,subject,tetx)

  res.status(200).json({
    message:"Sent successfully to Admin"
  })
})

// get dashboard stats api 
export const getstats=catchAsyncError(async(req,res,next)=>{
  const stats=await statsModel.find({}).sort({createdate:"desc"}).limit(12)
// console.log(stats)
  let statdata=[]

  for(let i=0;i<stats.length;i++){
    statdata.unshift(stats[i])
  }
  // console.log(statdata)
  const requiredStat=12 - stats.length
    console.log(requiredStat)

  for(let i=0;i<requiredStat;i++){
    console.log(i)
 statdata.unshift({
  users:0,
  subscriptions:0,
  views:0
 })
}
//  console.log(statdata)
//  console.log("working")
//  console.log("working")
 let usercount=statdata[10].users
//  console.log("working")
 let subscriptioncount=statdata[10].subscriptions
 let viewscount=statdata[10].views
//  console.log("working")
 let userprofit=true
 let viewsprofit=true
 let subscriptionprofit=true

 let userpercentage=0
 let subscriptionpercentage=0
 let viewspercentage=0
// console.log("working")
if (statdata[10].users===0) userpercentage = (usercount/100)*100
// console.log("working")
if (statdata[10].subscriptions===0) subscriptionpercentage = (subscriptioncount/100)*100
if (statdata[10].views===0) viewspercentage = (viewscount/100)*100
else{
  userpercentage= (statdata[11].users-statdata[10].users/statdata[10].users)*100
  subscriptionpercentage=(statdata[11].subscriptions-statdata[10].subscriptions/statdata[10].subscriptions)*100
  viewspercentage=(statdata[11].views-statdata[10].views/statdata[10].views)*100

  if(userpercentage<0){
    userprofit=false
  }
  if(subscriptionpercentage<0){
    subscriptionprofit=false
  }
  if(viewsprofit<0){
    viewsprofit=false
  }
}



 res.status(200).json({
  Status:"success"
  ,
  stats:statdata,
  viewscount,subscriptioncount,usercount,
  userpercentage,subscriptionpercentage,viewspercentage,
  userprofit,subscriptionprofit,viewsprofit

 })

  


})