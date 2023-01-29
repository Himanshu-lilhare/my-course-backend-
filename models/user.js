import mongoose from "mongoose";
import validator from "validator";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, , "please enter name"],
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    unique: true,
    minlength: [6, "password must be contain more than 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  subscription: {
    id: String,
    status: String,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: String,
    },
  ],
  createdate: {
    type: Date,
    default: Date.now,
  },
  ResetPasswordToken: String,
  ResetPasswordExpire: String,
});
userschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password,10);
    next();
  }else{
    next()
  }
});
userschema.methods.getJwtToken = function () {
  return Jwt.sign({ _id: this._id }, process.env.TOKENKEY, {
    expiresIn: "24d",
  });
};
userschema.methods.comparePassword=function(password){
      return bcrypt.compare(password,this.password)
}


// method for generating resetPassswordToken
userschema.methods.getresettoken=async function(){
  let resettoken= crypto.randomBytes(20).toString("hex")
        console.log(resettoken)
 this.ResetPasswordToken= crypto.createHash("sha256").update(resettoken).digest("hex")
 console.log(resettoken)
 console.log(this.ResetPasswordToken)
 this.ResetPasswordExpire= Date.now() + 15*60*1000

  return resettoken
}

export const usermodel = mongoose.model("user", userschema);
