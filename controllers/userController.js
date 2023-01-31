import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { usermodel } from "../models/user.js";
import ErrorHandling from "../utils/errorHandling.js";
import { sendemail } from "../utils/sendemail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { Course } from "../models/Course.js";
import getdatauri from "../utils/datauri.js";
import cloudinary from "cloudinary";
import { statsModel } from "../models/dashboardStats.js";

export const getallusers = catchAsyncError(async (req, res, next) => {
  const users = await usermodel.find({});
  res.status(200).json({
    success: "all user get successfully",
    users,
  });
});

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;
  console.log(name, email, password, file);
  if (!name || !email || !password || !file)
    return next(new ErrorHandling("Enter All Required Fields ", 400));

  let user = await usermodel.findOne({ email });

  if (user) {
    return next(new ErrorHandling("user already exist ", 401));
  } else {
    const fileuri = getdatauri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileuri.content);
    user = await usermodel.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });
    sendToken(res, user, "registered successfully", 201);
  }
});

// login controller

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // const file=req.file
  if (!email || !password)
    return next(new ErrorHandling("Enter All Required Fields ", 400));

  let user = await usermodel.findOne({ email }).select("+password");
  // console.log(user)

  if (!user) {
    return next(
      new ErrorHandling(" account does not exist,please create account ", 401)
    );
  } else {
    // console.log(user);
    let isright = await user.comparePassword(password);
    
    if (isright) {
      sendToken(res, user, "logged in successfully", 201);
    } else {
      next(new ErrorHandling("you type wrong password", 400));
    }
  }
});

// logout controler

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .json({
      Sucess: "loged out",
    });
});

//  get data of user after login

export const getacces = catchAsyncError(async (req, res, next) => {
  let user = await usermodel.findById(req.user._id);
  if (!user) return next(new ErrorHandling("your account doesnot exist ", 400));

  res.status(200).json({ user });
});

//  api for changepassword

export const changepassword = catchAsyncError(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword)
    return next(new ErrorHandling("enter all required fields", 400));

  const user = await usermodel.findById(req.user._id).select("+password");
  let isOldpasswordRight = await user.comparePassword(oldpassword);
  if (isOldpasswordRight) {
    user.password = newpassword;
    await user.save();
    res.status(200).json({
      succes: "Password changed",
      user,
    });
  } else {
    next(new ErrorHandling("incorret old password", 400));
  }
});

// api for update profile

export const updateprofile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email)
    return next(new ErrorHandling("please enter all fields ", 400));

  let user = await usermodel.findById(req.user._id);

  user.email = email;
  user.name = name;

  await user.save();
  res.status(200).json({
    succes: "profile updated",
    user,
  });
});

// api for update avtar

export const updateavatar = catchAsyncError(async (req, res, next) => {
  const user = await usermodel.findById(req.user._id);
  const file = req.file;
  if (!file) return next(new ErrorHandling("please upload Avatar", 401));
  const fileuri = getdatauri(file);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  const mycloud = await cloudinary.v2.uploader.upload(fileuri.content);

  user.avatar.public_id = mycloud.public_id;
  user.avatar.url = mycloud.secure_url;
  await user.save();
  res.status(200).json({
    success: true,
    message: "avatar changed",
  });
});
// ye banayege badme

// api for forget password

export const forgetpassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandling("please enter email"));

  const user = await usermodel.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandling("Email doest exist,Please enter right email")
    );
  }

  let resettoken = await user.getresettoken();
  await user.save();
  // now send email with token for reset password,so
  // make sendemail.js in utils
  const message = "Here Is your Link";
  // console.log(resettoken)
  const url = `${process.env.FRONTENDURL}/reset/${resettoken}`;
  sendemail(user.email, "FITCODING RESET PASSWORD", ` ${message} ${url}`);
  res.json({
    succes: "link sent to your provided email",
  });
});

export const resetpassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const ResetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await usermodel.findOne({
    ResetPasswordToken,
    ResetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) return next(new ErrorHandling("user dosent find", 400));

  user.password = req.body.password;
  user.ResetPasswordToken = undefined;
  user.ResetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    succes: "reset password successfully",
    token,
  });
  // st("hex")
});

// addtoplaylist Api

export const addtoplaylist = catchAsyncError(async (req, res, next) => {
  const user = await usermodel.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandling("course is not available", 404));

  let isexist = user.playlist.find((item) => {
    if (item.course == course._id.toString()) return true;
  });
  console.log(isexist);

  if (isexist) return next(new ErrorHandling("course exist already ", 400));

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });
  await user.save();
  res.status(200).json({
    success: "added to Playlist",
  });
});

export const removefromplaylist = catchAsyncError(async (req, res, next) => {
  const user = await usermodel.findById(req.user._id);

  const course = await Course.findById(req.query.id);

  if (!course) return next(new ErrorHandling("course is not available", 404));

  // let newplaylist = user.playlist.filter((item) => {
  //   if (item.course == course._id){
  //     return item;
  //   }
  // });

  const newplaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) return item;
  });
  user.playlist = newplaylist;

  await user.save();
  res.status(200).json({
    success: "Removed",
  });
});

export const makeAdminOrUser = catchAsyncError(async (req, res, next) => {
  const user = await usermodel.findById(req.params.id);

  if (!user) return next(new ErrorHandling("user doesnt exist", 400));
  console.log("2");
  if (user.role == "user") {
    user.role = "admin";
  } else {
    user.role = "user";
  }
  await user.save();
  res.status(200).json({
    success: "Role successfully changed",
    role: user.role,
  });
});

// api for delete user

export const deleteuser = catchAsyncError(async (req, res, next) => {
  const user = await usermodel.findById(req.params.id);
  if (!user) return next(new ErrorHandling("User nof Found", 404));

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  await user.remove();
  res.status(200).json({
    success: "User deleted",
  });
});

// api for delete profile by user

export const deleteprofile = catchAsyncError(async (req, res, next) => {
  const user = await usermodel.findById(req.user._id);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  await user.remove();
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({
    Sucees: "Profile deleted",
  });
});

usermodel.watch().on("change", async () => {

  const stats = await statsModel.find({}).sort({ createdate: "desc" }).limit(1);
 

  stats[0].users = await usermodel.countDocuments();

  const subscriptions = await usermodel.find({
    "subscription.status": "active",
  });
  stats[0].subscriptions = subscriptions.length;
  stats[0].createdate = new Date(Date.now());

  let course = await Course.find({});
  let totalviews = 0;

  for (let i = 0; i < course.length; i++) {
    totalviews = course[i].views + totalviews;
  }
  stats[0].views = totalviews;
  await stats[0].save();
});
