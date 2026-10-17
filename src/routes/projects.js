const express = require('express');
const path = require('path')
const fs = require('fs')
const authenticationMiddleWareSignIn = require('../middleware/auth')
const project = express();
require('dotenv').config({
    path:path.resolve(__dirname,'../../.env')
})
project.use(express.json())
const filePath = path.resolve(__dirname,'../data/todos.json')
const PORT = process.env.PORT;
const findIndex = (array,id) => {
    for(let i=0;i<array.length;i++){
        if(array[i].id==id) return i;
    }
    return -1;
}

const removeTodo = (array,index) => {
    let newTodoList = [];
    for(let i=0;i<array.length;i++){
        if(index!=i) newTodoList.push(array[i]);
    }
    return newTodoList;
}

project.get('/todos',authenticationMiddleWareSignIn,(req,res)=>{
    fs.readFile(filePath,"utf-8",(err,data)=>{
        if(err) throw err;
        res.status(200).send(JSON.parse(data))
    })
})

project.get('/todos/:id',authenticationMiddleWareSignIn,(req,res)=>{
    fs.readFile(filePath,"utf-8",(err,data)=>{
        if(err) throw err;
        let todos = JSON.parse(data)
        let todoIndex = findIndex(todos,parseInt(req.params.id))
        if(todoIndex===-1) return res.status(404).send({
            message:"Error with the index number"
        }) 
        res.status(200).send(todos[todoIndex])
    })
})

project.post('/todos',authenticationMiddleWareSignIn,(req,res)=>{
    let newTodo = {
        id: Math.floor(Math.random()*10000000),
        title:req.body?.title,
        description:req.body.description
    }
    fs.readFile(filePath,"utf-8",(err,data)=>{
        if(err) throw err;
        let todos = JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile(filePath,JSON.stringify(todos),(err,data)=>{
            if(err) throw err;
            res.json(newTodo)
        })
    })
})

project.put('/todos/:id',authenticationMiddleWareSignIn,(req,res)=>{
    fs.readFile(filePath,"utf-8",(err,data)=>{
        if(err) throw err;
        let todos = JSON.parse(data);
        let todoIndex = findIndex(todos,parseInt(req.params.id))
        if(todoIndex===-1) return res.status(404).send({
            message:"Error is opening the todo list"
        })
        let updateTodo = {
            id: todos[todoIndex]?.id,
            title:req.body?.title,
            description:req.body?.description
        }
        todos[todoIndex] = updateTodo;
        fs.writeFile(filePath,JSON.stringify(todos),(err,data)=>{
            res.status(200).json(updateTodo);
        })
    })
})

project.delete('/todos/:id',authenticationMiddleWareSignIn,(req,res)=>{
    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err) throw err;
        let todos = JSON.parse(data);
        let todoIndex = findIndex(todos,parseInt(req.params.id));
        if(todoIndex==-1) return res.status(404).send("Error is finding the index of todo list")
        let newList = removeTodo(todos,todoIndex);
        fs.writeFile(filePath,JSON.stringify(newList),(err,data)=>{
            if(err) throw err;
            res.status(200).json(newList)
        })
    })
})

project.use((req,res)=>{
    res.status(404).send("Page not found")
})

project.listen(PORT,(req,res)=>{
    console.log(`The servering is running on the ${PORT}`)
})

module.exports = project
