const express = require('express');
const fs = require('fs')
const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config({
    path:path.resolve(__dirname,'../../.env')
});
const authenticationMiddleWareSignUp = require('../middleware/auth')
const authenticationMiddleWareSignIn = require('../middleware/auth')
const verificationOfJWT = require('../middleware/auth')
const usersFile = path.resolve(__dirname,'../data/users.json')

const auth = express();


const JWT = process.env.JWT_SECRET;


auth.use(express.json());


const creatingUser  = async (username,password,name) =>{
    return {
        username:username,
        password: await bcrypt.hash(password,10),
        name:name
    }
}

auth.post('/signup',authenticationMiddleWareSignUp, (req,res)=>{
    const {username,password,name} = req.body;
    let usersList;
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

const verification = async (username,password,usersList) =>{ 
    const user =  usersList.find(user=> user.username==username);
    if(!user) return false;

    const isValid = await bcrypt.compare(password,user.password);
    
    return isValid ? true : false;
}

auth.post('/signin',authenticationMiddleWareSignIn, (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    let usersList;
    fs.readFile(usersFile,"utf-8",async (err,data)=>{
        if(err) return res.status(500).json({
            msg:"Internal server failuer."
        })

        try{
            usersList = JSON.parse(data);
            if(!Array.isArray(usersList)){
                return res.status(500).json({
                    msg:"Invalid user data."
                })
            }
        }catch(err){
            return res.status(500).json({
                msg:"Invalid user data"
            })
        }

        if(!await verification(username,password,usersList)){
            return res.status(401).json({
                msg:"User not found"
            })
        }
        
        const token = jwt.sign({username:username},JWT)

        res.status(200).json({
            msg:"User found!!",
            token
        })

    })


})

auth.get('/protected',verificationOfJWT,(req,res)=>{
    res.status(200).json({
        msg:"Access granted!!"
    })
})

module.exports = auth;