const zod = require('zod');
const schema = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8),
    name:zod.string().nonempty(),
})

const validatingInput = (username,password,name) =>{
    const response = schema.safeParse({username,password,name});
    if(response.success)
        return true;
    return false
}

const authenticationMiddleWare = (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    if(!validatingInput(username,password,name))
        return res.status(400).json({
            msg:"Invalid input data!!"
        })
    else
        next();
}

module.exports = authenticationMiddleWare;