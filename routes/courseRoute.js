import express from "express"
import { addlectures, createcourse, deletecourse, deletelecture, getallcourses, getcourselectures } from "../controllers/coursesController.js"
import { singleupload } from "../middlewares/multer.js"

import {getaccessafterlogin, adminORuser } from "../middlewares/findWhichUserLogin.js"
import { subscriberOrNot } from "../middlewares/subscriberOrNot.js"
const router=express.Router()

router.route("/courses").get(getallcourses)

router.route("/createcourse").post(getaccessafterlogin,adminORuser, singleupload, createcourse)

// getcourse lectures,delete lcourse,createcourse,add lectures

router.route("/course/:id").get(getaccessafterlogin,subscriberOrNot,getcourselectures).

post(getaccessafterlogin,adminORuser,singleupload, addlectures )
.delete(getaccessafterlogin,adminORuser,deletecourse)

// for delete lectures
router.route("/lecture").delete(getaccessafterlogin,adminORuser,deletelecture)
export default router