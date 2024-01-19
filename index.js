"use strict"
require('dotenv').config()




const cookieParser = require('cookie-parser') 
const express = require('express')
const cors = require('cors');
const ticTacRouter = require('./routes/tic-tac-routes') 



const app = express()
app.use(cors())
app.use(express.json())   
app.use(cookieParser())
app.use('', ticTacRouter)   

app.get('/',(req, res)=> {
  const host = req.get('host')
  res.json({host, hell: "hello"})
})

// console.log(process.env.DEVELOPMENT_ATLAS_URI)
// app.use(cors({
//   origin: 'http://127.0.0.1:5502', // replace with the actual origin of your frontend
//   credentials: true,
// }
// ))




const PORT = process.env.PORT_EXPRESS_SERVER || 5500
app.listen(PORT, () => {
  console.log(`server is working on server ${PORT}`) 
})

