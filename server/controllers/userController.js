import userModel from "../models/userModel.js";

export const getUserData = async (req,res)=>{
    try {
        const {userID} = req.body;
        
        const user = await userModel.findById(userID);
        if(!user){
            return res.json({success : false , message : "User do not exist"});
        }

        return res.json({
            success : true,
            userData : {
                name : user.name,
                isAccountVerified : user.isAccountVerified,
                email : user.email
            }
        });
    } catch (error) {
        res.json({success : false , message : error.message});
    }
}