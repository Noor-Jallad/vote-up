import postModel from "../../../../DB/model/Post.model.js";
import { asyncHandler } from '../../../Services/errorHandling.js';
import cloudinary from '../../../Services/cloudinary.js';
import { compare, hash } from '../../../Services/hashAndCompare.js';
import commentModel from './../../../../DB/model/Comment.model.js';

export const getPosts=asyncHandler(async(req,res,next)=>{
const posts=await postModel.find({}).populate([
    {
        path:'userId',
        select:'userName'
    },
    {path:'like',
    select:'userName'},
    {path:'unlike',
    select:'userName'}
]
    )
const postList= [];
for(const post of posts){
    const comment= await commentModel.find({postId:post._id});
    postList.push({post,comment});
}
return res.status(200).json({message:"Success",postList});
})
export const getPostsQueries=asyncHandler(async(req,res,next)=>{
    const cursor=await postModel.find({}).populate([
        {
            path:'userId',
            select:'userName'
        },
        {path:'like',
        select:'userName'},
        {path:'unlike',
        select:'userName'}
    ]).cursor();
    const postList= [];
   for(let doc=await cursor.next(); doc!=null; doc=await cursor.next()){
    const comment= await commentModel.find({postId:doc._id});
    postList.push({post:doc,comment});
   }
    return res.status(200).json({message:"Success",postList});
    })
export const createPost= asyncHandler(async(req,res,next)=>{
    const {title,caption}= req.body;
    const id= req.id;

    const {secure_url ,public_id }=await cloudinary.uploader.upload(req.file.path,{folder:"Post"});
    const post = await postModel.create({title,caption,image:{secure_url,public_id},userId:id});
    return res.status(201).json({message:"Success",post});
})

export const likePost=asyncHandler(async(req,res,next)=>{
const uId= req.id;
const {id}=req.params;
const post = await postModel.findByIdAndUpdate(id,
    {
        // $push:{like:uId}
        $addToSet:{ like:uId},
        $pull:{ unlike: uId}


    },{new:true});
    return res.status(200).json({message:"Success",post});
})

export const unlikePost=asyncHandler(async(req,res,next)=>{
    const uId=req.id;
    const {id}= req.params;
    const post= await postModel.findByIdAndUpdate(id,{
        // $push: {unLike:uId}
        $addToSet:{ unlike:uId},
        $pull:{like:uId}
    },{ new:true});
    post.totalVote =post.like.length-post.unlike.length;
    await post.save();
    return res.status(201).json({message:"Success",post});
})






