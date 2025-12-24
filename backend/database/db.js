import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('DB CONNECTED');
    }
    catch(error){
        console.log('Error connecting in DB');
        process.exit(1);
    }
}
export default connectDB;