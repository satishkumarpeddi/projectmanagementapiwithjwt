const auth = require('./routes/auth')

auth.listen(3000,()=>{
    console.log('Server is running on the port : 3000')
})