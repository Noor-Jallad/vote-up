import {Router} from 'express';
import * as userController from './Controller/User.controller.js';
import { auth } from '../../Middleware/auth.middleware.js';
import { asyncHandler } from '../../Services/errorHandling.js';
// import fileUpload, { fileValidation } from '../../Services/multer.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js';
import * as validators from "./User.validation.js";
const router =Router();

router.patch('/profilePic',auth,fileUpload(fileValidation.image).single('image'),validation(validators.profilePic),userController.profilePic)
router.patch('/coverpic',auth,fileUpload(fileValidation.image).array('image',5),userController.coverPic)
router.patch('/updatePassword',auth,validation(validators.updatePassword),userController.updatePassword);
router.get('/:id/profile',userController.shareProfile);

export default router;