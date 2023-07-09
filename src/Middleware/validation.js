
const dataMethods = ['body','query','params','headers'];
import joi from "joi";

export const generalFields={
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:joi.string().min(3).required(),
    file: joi.object({
        fieldname:joi.string().required() ,
        generalname:joi.string().required()  ,
        encoding: joi.string().required() ,
        mimetype: joi.string().required()  ,
        destination: joi.string().required()  ,
        filename: joi.string().required() ,
        path: joi.string().required() ,
        size:joi.number().positive().required() , 
        dest: joi.string()
    }).required(),
    id: joi.string().min(24).max(24).required()
}
const validation = (schema)=>{
    return (req,res,next)=>{
        const valiadtionArray = [];
        dataMethods.forEach(key=>{
            if(schema[key]){
               const validationResult = schema[key].validate(req[key],{abortEarly:false});

               if(validationResult.error){
                valiadtionArray.push(validationResult.error.details);
               }
            }
        } )
        if(valiadtionArray.length >0){
            return res.json({message:"valiation error",valiadtionArray});
        }return next();
}
}
export default validation;