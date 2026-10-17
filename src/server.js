const express = require('express');
const authRoutes = require('./routes/auth')
const projectRoutes =  require('./routes/projects')
const path = require('path')
require('dotenv').config({
    path:path.resolve(__dirname,'../../.env')
})
const PORT = process.env.PORT || 3000;
const app= express();
app.use('/',projectRoutes)
app.use('/auth',authRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on the port : ${PORT}`)
})