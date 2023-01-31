import express  from "express";
import dotenv from "dotenv"

import router from "./routes/courseRoute.js";
import user from "./routes/userRoute.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import payrouter from "./routes/paymentroute.js";
import otherroute from "./routes/otherRoutes.js";

// agar frontend backend ko connect karna
//  hia to cors ko use karna padega
import cors from "cors"

dotenv.config({
    path:"./config/.env"
})

const app=express()


// using middlewraes

app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))



// app.use(cors())

app.use(cookieParser())
// to cors me kuch mandatory chize deni hai 
// otherwise hum cookie transfer nahi kar payge
app.use(cors({
    origin:'https://my-startup-frontend.vercel.app',
    credentials:true,
    method:["GET","POST","PUT","DELETE"]
}))


// importing routes
app.use(router)
app.use(user)
app.use(payrouter)
app.use(otherroute)
app.get("/",(req,res)=>{
    res.send(`<h1>here is the <a href=${process.env.FRONTENDURL} >link</a> for frontend `)
})
 export default app


 app.use(errorMiddleware)