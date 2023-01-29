import { createTransport } from "nodemailer";

export const sendemail=(to,message,text)=>{

    const transporter=createTransport({
    host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
           user: "1671c5ede86682",
           pass: "dcef83a1bb1c09"
        } 
})

    transporter.sendMail({
        to,message,text,from:"iamraj@gmail.com"
    })
}