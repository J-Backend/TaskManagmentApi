require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 3000
const path = require('path');
const moongose = require('mongoose')
const dbConnection = require('./config/dbConnection')
const { default: mongoose } = require('mongoose')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser');

const app = express()

//MongoDB connection
dbConnection()

//Middleware
// app.use(cors(corsOptions))
app.use(cors())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json())

//Routes
app.use('/', require('./routes/root'))
app.use('/auth',require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRouter'))
app.use('/api/tasks', require('./routes/taskRouter'))
app.use('/api/projects', require('./routes/projectRouter'))

//Error Not Found
app.all('*', (req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message:'404 Not Found'})
    }else{
        res.type('txt').send('404 Not Found')
    }
})

//Error Handler Middleware
app.use(errorHandler)

//Listening 
mongoose.connection.once('open',()=>{
    console.log("Starting db connection")
    app.listen(PORT,()=> console.log(`Server listening on port ${PORT}` ))
})

moongose.connection.on('error',()=>{
    console.log("Server error: ",error )
})


