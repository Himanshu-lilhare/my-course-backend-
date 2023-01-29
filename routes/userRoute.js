import express from "express"
import { addtoplaylist, changepassword, deleteprofile, deleteuser, forgetpassword, getacces, getallusers, login, logout, makeAdminOrUser, register, removefromplaylist, resetpassword, updateavatar, updateprofile } from "../controllers/userController.js"
import { adminORuser, getaccessafterlogin } from "../middlewares/findWhichUserLogin.js"
import { singleupload } from "../middlewares/multer.js"

const user=express.Router()

//// for get all user jo ki sirf admin hi akr skta hai 
user.route("/users").get(getaccessafterlogin,adminORuser,getallusers)

// route fro reguster user
user.route("/register").post(singleupload,register)

user.route("/login").post(login)

user.route("/logout").get(logout)

user.route("/me").get(getaccessafterlogin,getacces).
delete(getaccessafterlogin,deleteprofile)



user.route("/changepassword").put(getaccessafterlogin,changepassword)

user.route("/updateprofile").put(getaccessafterlogin,updateprofile)
user.route("/changeavatar").put(getaccessafterlogin,singleupload,updateavatar)

user.route("/forgetpassword").post(forgetpassword)

user.route("/resetpassword/:token").put(resetpassword)

// save course in playlist

user.route("/addtoplaylist").post(getaccessafterlogin,addtoplaylist)

user.route("/removefromplaylist").delete(getaccessafterlogin,removefromplaylist)


// make addmin to user or user to admin
//  and also for delete user

user.route("/admin/user/:id").
put(getaccessafterlogin,adminORuser,makeAdminOrUser).
delete(getaccessafterlogin,adminORuser,deleteuser)




export default user