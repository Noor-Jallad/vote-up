import {Router} from 'express';
import * as commentController from './controller/Comment.controller.js';
import * as postController from './controller/Post.controller.js';
// import fileUpload, { fileValidation } from '../../Services/multer.js';
import validation from './../../Middleware/validation.js';
import * as validators from "./Post.validation.js";

import { auth } from './../../Middleware/auth.middleware.js';
import fileUpload from '../../Services/multerCloudinary.js';
import { fileValidation } from './../../Services/multerCloudinary.js';
const router =Router();
router.get('/',postController.getPosts);
router.post('/',auth,fileUpload(fileValidation.image).single('image'),postController.createPost);
router.patch('/:id/like',auth,postController.likePost);
router.patch('/:id/unlike',auth,postController.unlikePost);
//comment section
router.post('/:id/comment',auth,fileUpload(fileValidation.image).single('image'),commentController.createComment);


export default router;