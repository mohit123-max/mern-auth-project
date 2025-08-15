//take userID from token-cookie and add it to res.body
import jwt from "jsonwebtoken";

const userAuth = async(req,res,next)=>{
    const userCookies = req.cookies;

    if(!userCookies){
        return res.json({success : false , message : "User not Authorized . Login Again"});
    }

    const token = userCookies.token;
    if(!token){
        return res.json({success : false , message : "User not Authorized . Login Again"});
    }

    try {
        const tokenDecoded = jwt.verify(token , process.env.JWT_SECRET_KEY);  
        if(tokenDecoded.id){

            if(!req.body){
                req.body = {}
            } //setting the req.body , if it is not set (i.e. nothing is sent in body) 

            req.body.userID = tokenDecoded.id;
        }else{
            return res.json({success : false , message : "User not Authorized . Login Again"});
        }

        next();

    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}

export default userAuth;