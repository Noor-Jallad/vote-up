import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from './../../../Services/errorHandling.js';
import cloudinary from 'cloudinary';
import { compare, hash } from './../../../Services/hashAndCompare.js';

export const profile = (req,res)=>{
        return res.json({message:"profile"});
}
export const profilePic = asyncHandler(async (req,res,next)=>{
    
        if(!req.file){
                return next(new Error("Please provide a file"))
        }
        // const user=await userModel.findByIdAndUpdate(req.id,{profilePic:`${req.file.dest}`}
        // ,{new:true})
        // return res.json({message:"Success",user});
        const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`user/${req.id}/profile`});
        const user=await userModel.findByIdAndUpdate(req.id,{profilePic:secure_url, profilePublicUrl:public_id},{new:true});
        if(user.profilePublicUrl){
         await cloudinary.uploader.destroy(user.profilePublicUrl);
        }
        return res.json({message:"Success", user});
})

export const coverPic = async (req,res)=>{
    
        if(!req.files?.length){
                return next(new Error("Please provide a file"))

        }
       //await userModel.findByIdAndUpdate(req.id,{profilePic:`upload/${req.file.filename}`})
        const coverPic=[];
        for (const file of req.files) {
                coverPic.push(`${file.dest}`);
        }
       const user= await userModel.findByIdAndUpdate(req.id,{coverPic:coverPic},{new:true})
        
        return res.json({message:"success",user});
}
export const updatePassword=async(req,res)=>{
const {oldPassword,newPassword}=req.body;
const userExist= await userModel.findById(req.id);
if(!userExist)
return res.json("User isn't exist");

const match= compare(oldPassword,userExist.password);
if(!match)
{
        return res.json({message:"Invalid Password"});
}
const hashPassword= hash(newPassword);
const userUpdate=await userModel.findByIdAndUpdate(req.id, {password:hashPassword},{new:true});
return res.json({message:"Success",userUpdate});
}

export const shareProfile=async(req,res)=>{
const {id}= req.params;
const user=await userModel.findById(id).select('userName email');
if(!user)
{
        return next(new Error("Invalid profile id"));
}
return res.json({message:"Success",user})
}