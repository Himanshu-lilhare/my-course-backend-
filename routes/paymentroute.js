import  express  from "express";
import { canclesubs, getrazorpaykey, getsubscribed, paymentVerify } from "../controllers/paymentcontroller.js";
import { getaccessafterlogin } from "../middlewares/findWhichUserLogin.js";

const payrouter=express.Router()

payrouter.route("/subscribe").get(getaccessafterlogin,getsubscribed)

payrouter.route("/paymentverification").post(getaccessafterlogin,paymentVerify)

payrouter.route("/getkey").get(getrazorpaykey)

payrouter.route("/canclesubscription").delete(getaccessafterlogin,canclesubs)




export default payrouter