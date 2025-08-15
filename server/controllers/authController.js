import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE} from "../config/emailTemplates.js"

export const register = async (req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success : false , message : "Missing Details"});
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false , message : "User with this email already exists"});
        }

        const hashedPassword =  await bcrypt.hash(password,10);

        const user = new userModel({name,email,password : hashedPassword});
        await user.save();

        const data = {id: user._id};
        const token = jwt.sign(data , process.env.JWT_SECRET_KEY , {expiresIn : "7d"});

        res.cookie("token" , token , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : (7*24*60*60*1000)  //7days
        });

        (async ()=>{
            const info = await transporter.sendMail({
                            from : "ms7920475@gmail.com",
                            to : email,  
                            subject : "Welcome to Auth Project ! Registration successfull",
                            text : `Welcome to Project Authentication . Your account has been created with email ID : ${email}`,
                            //html : "<b>Hello Sir , Welcome"  //send either text or html
                        });
            if(info.rejected.length > 0){
                console.log("Email not sent due to some reasons");
            }
            else{
                console.log("Registration mail sent successfully");
            }
        }
        )();  //IEFE 

        return res.json({success : true , message : "Registration Successfull"});

    } catch (error) {
        return res.json({success : false , message : error.message});
    }
}


export const login = async(req,res)=>{
    const {email , password} = req.body;

    if((!email) || (!password)){
        return res.json({success : false , message : "Email or Password missing"});
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success : false , message : " User with this Email does not exist"});
        }

        // const hashed_password = bcrypt.hash(password,10);
        // if(user.password !== hashed_password){
        //     return res.json({success : false , message : " Wrong Password"});
        // }  // wrong way

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success : false , message : " Wrong Password"});
        }
        else{
            const data = {id: user._id};
            const token = jwt.sign(data , process.env.JWT_SECRET_KEY , {expiresIn : "7d"});

            res.cookie("token" , token , {
                httpOnly : true,
                secure : process.env.NODE_ENV === "production",
                sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge : (7*24*60*60*1000)  //7days
            });

            return res.json({success : true ,message : "Login Successfull"});
        }


    } catch(error){
        return res.json({success : false , message : error.message});
    }
}


export const logout = async (req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        })

        res.json({success : true , message : "Logged Out"});
    } catch (error) {
        res.json({success : false , message : error.message});
    }
}


export const sendVerifyOtp = async (req,res)=>{
    try{
        const {userID} = req.body;

        const user = await userModel.findById(userID);
        if(!user){
            return res.json({success : false , message : "User don't exist with given userID"});
        }
        if(user.isAccountVerified){
            return res.json({success : false, message : "Account already verified."})
        }

        const otp = String(Math.floor(100000 + Math.random()*900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10*60*1000;  // expires in 10min

        await user.save();

        const info = await transporter.sendMail({
            from : "ms7920475@gmail.com",
            to : user.email, 
            subject : "Account verify OTP",
            // text : `${otp} is the OTP to verify your account on Project1. The OTP will expire in 10 min.`
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        });

        if(info.rejected.length >0){
            return res.json({success : false , message : "email not sent due to some reasons"});
        }
        else{
            return res.json({success : true , message : "OTP sent successfully"})
        }

    } catch(error){
        return res.json({success : false , message : error.message});
    }
}


export const verifyEmail = async (req,res)=>{
    const {userID , otp} = req.body;

    if(!userID || !otp){
        return res.json({success : false , message : "Missing details"});
    }

    try {
        const user = await userModel.findById(userID);
        if(!user){
            return res.json({success : false , message : "User don't exist with given userID"});
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success : false , message : "Invalid OTP"});
        }
        if(Date.now() > user.verifyOtpExpireAt){
            return res.json({success : false , message : "OTP expired"});
        }
        else{
            user.isAccountVerified = true;
            user.verifyOtp = "";
            user.verifyOtpExpireAt = 0;
            await user.save();
            return res.json({success : true , message : "Email verified successfully"});
        }
    } catch (error) {
        return res.json({success : false , message : error.message});
    }
}


export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({success : true , message : "User is logged In"});
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}

export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success : false , message : "Missing email iD"})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success : false , message : "No user found with given email ID"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10*60*1000  // 10min
        await user.save();

        const info = await transporter.sendMail({
            from : "ms7920475@gmail.com",
            to : email,
            subject : "Password Reset Otp",
            // text : `Your Otp for password reset is ${otp} . It will expire in 10 min.` 
            html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        })
        if(info.rejected.length > 0){
            return res.json({success : false , message : "OTP not sent due to internal issues"})
        }
        else{
            return res.json({success : true , message : "OTP sent"})
        }
    } catch(error){
        return res.json({success : false , message : error.message})
    }

}


export const resetPassword = async(req,res)=>{
    const {email , otp ,newPass} = req.body;
    if(!email || !otp || !newPass){
        return res.json({success : false , message : "Missing details"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success : false , message : "User not registered"});
        }

        if(user.resetOtp==="" || otp!==user.resetOtp){
            return res.json({success : false , message : "Wrong OTP"});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success : false , message : "OTP expired"});
        }

        user.resetOtp = "";
        user.resetOtpExpireAt=0;
        user.password = await bcrypt.hash(newPass,10);
        await user.save();

        return res.json({success : true , message : "Password reset successfull"});

    } catch (error) {
        return res.json({success : false , message : error.message});
    }
}