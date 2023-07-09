import postModel from "../../../../DB/model/Post.model.js";
import { asyncHandler } from '../../../Services/errorHandling.js';
import cloudinary from '../../../Services/cloudinary.js';
import commentModel from './../../../../DB/model/Comment.model.js';

export const createComment = asyncHandler(async(req,res,next)=>{
    req.body.userId= req.id;
    req.body.postId= req.params.id;
    if(req.file){
        const {secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{folder:'comment'});
        req.body.image={secure_url, public_id};
    }
    const comment = await commentModel.create(req.body);
    return res.status(200).json({message:"Success",comment});
})