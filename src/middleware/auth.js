const zod = require('zod');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const path = require('path')
const schemaSignUp = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8),
    name:zod.string().nonempty(),
})

const schemaSignIn = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8), 
})

dotenv.config({
    path:path.resolve(__dirname,'../../.env')
})

const JWT = process.env.JWT_SECRET;

const validatingInputSignUp = (username,password,name) =>{
    const response = schemaSignUp.safeParse({username,password,name});
    if(response.success)
        return true;
    return false
}


const validatingInputSignIn = (username,password) => {
    const response = schemaSignIn.safeParse({username,password});
    if(response.success)
        return true;
    return false;
}
const authenticationMiddleWareSignUp = (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    if(!validatingInputSignUp(username,password,name))
        return res.status(400).json({
            msg:"Invalid input data!!"
        })
    else
        next();
}

const authenticationMiddleWareSignIn = (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!validatingInputSignIn(username,password))
        return res.status(400).json({
            msg:"Invalid input data!!"
        })
    else
        next();
}

const verificationOfJWT = (req,res,next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader) return res.status(404).json({
        msg:"Authorization token is required"
    })

    const token = authHeader;
    
    if(!token){
        return res.status(401).json({
            msg:"Authorization token is required!!"
        })
    }

    try{
        const decoded = jwt.verify(token,JWT);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            msg:"Invalid or expired token"
        })
    }

}


module.exports = authenticationMiddleWareSignUp;
module.exports = authenticationMiddleWareSignIn;
module.exports = verificationOfJWT;