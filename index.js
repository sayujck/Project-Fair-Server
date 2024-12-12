require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./config/connection')

const pfServer = express()

pfServer.use(cors())
pfServer.use(express.json())
pfServer.use(router)
pfServer.use('/uploads',express.static('./uploads'))

const PORT = 3000 || process.env.port

pfServer.listen(PORT,()=>{
    console.log(`Project fair server started at ${PORT} and waiting for client request`);
    
})

pfServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style="color:red">Project fair server started at and waiting for client request</h1>`)
})
