import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import { authRouter } from "./routes/authroutes.js";
import { userRouter } from "./routes/userroutes.js";

const app = express();
const port = process.env.PORT || 4000;
const allowedUrl = ["http://localhost:5173","https://user-auth-mern-project.netlify.app"];
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials : true , origin : allowedUrl})); // Allow all origins, change to specific origin in production

//API -ENDPOINTS
app.get('/',(req,res)=>{
    res.send("API WORKING");
})

app.use("/api/auth",authRouter);  // full path will be /api/auth/register , /api/auth/login
app.use("/api/user",userRouter);


app.listen(port,()=>{
    console.log(`Server is started ar PORT : ${port}`);
});
