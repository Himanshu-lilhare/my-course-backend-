

export const sendToken=(res,user,message,statuscode=200)=>{

   let token= user.getJwtToken()
   
   const options={
    expires:new Date(Date.now()+ 24*12*60*60*1000),
    httpOnly:true,
    sameSite:"none",
    secure:true
   }

res.status(statuscode).cookie("token",token,options).json({
success:true,
message,
    user,
    token
})

}