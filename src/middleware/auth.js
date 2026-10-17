const zod = require('zod');
const schemaSignUp = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8),
    name:zod.string().nonempty(),
})

const schemaSignIn = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8), 
})

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


module.exports = authenticationMiddleWareSignUp;
module.exports = authenticationMiddleWareSignIn;