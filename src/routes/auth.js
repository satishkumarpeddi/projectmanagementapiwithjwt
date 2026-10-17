const express = require('express');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const fs = require('fs')
const bcrypt = require('bcrypt')
const path = require('path')

const usersFile = path.resolve(__dirname,'../data/users.json')

const auth = express();

auth.use(express.json());

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

const creatingUser  = async (username,password,name) =>{
    return {
        username:username,
        password: await bcrypt.hash(password,10),
        name:name
    }
}

auth.post('/signup', (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    let usersList;
    if(!validatingInput(username,password,name)) 
        return res.status(400).send({
            "msg":"Invalid input"
    }) 
    fs.readFile(usersFile,"utf-8", async (err,data)=>{
        if(err) return res.status(500).send({
            msg:"Internal server error",
        })
        try{
           usersList = JSON.parse(data);
           if(!Array.isArray(usersList)){
            return res.status(500).json({
                msg:"Invalid user data"
            })
           }
        }catch(err){
            return res.status(500).json({
                msg:"Invalid user data"
            })
        }
        const existingUser = usersList.find(user => {
            return user.username === username
        })!==undefined;
        if(existingUser){
            return res.status(409).json({
                msg:"User already exists"
            })
        }
        const newUser = await creatingUser(username,password,name);
        usersList.push(newUser);
        fs.writeFile(usersFile,JSON.stringify(usersList),(err,data)=>{
            if(err) return res.status(500).send({
                msg:"Write Internal server error"
            })
            res.status(201).send({
                username:newUser.username,
                name:newUser.name
            })
        })
    })
})

module.exports = auth;