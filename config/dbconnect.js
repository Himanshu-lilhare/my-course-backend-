import mongoose from "mongoose";

export const dbconnect= async()=>{
  const {connection} = await mongoose.connect(process.env.MONGO_URI)
  console.log("database is connect with "+ connection.host)
}