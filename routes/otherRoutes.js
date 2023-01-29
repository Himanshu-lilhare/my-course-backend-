import express from "express"
import { contact, getstats, requestcourse } from "../controllers/otherRoutesController.js"
import { adminORuser, getaccessafterlogin } from "../middlewares/findWhichUserLogin.js"

const otherroute=express.Router()

otherroute.route("/contact").post(contact)
otherroute.route("/requestcourse").post(requestcourse)


// route fro stats of dashboard

otherroute.route("/getstats").get(getaccessafterlogin,adminORuser,getstats)
export default otherroute
