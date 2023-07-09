
import connectDB from '../../DB/connection.js';
import { globalErrorHandler } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import postRouter from './Post/Post.router.js';

import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath = path.join(__dirname,'../upload');

const initApp=(app,express)=>{
    connectDB();
    app.use('/upload',express.static(fullPath))
    app.use(express.json());
    app.use("/auth", AuthRouter);
    app.use('/post', postRouter);
    app.use('/user', UserRouter);


    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })
    
    //error handling middleware
    app.use(globalErrorHandler)
}

export default initApp;