"use strict"
require('dotenv').config()

const cookieParser = require('cookie-parser')
const expressSession = require('express-session'); 
const express = require('express')
const cors = require('cors');

// const { MongoClient,ObjectId  } = require('mongodb');
const ticTacRouter = require('./routes/tic-tac-routes') 



const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/',ticTacRouter)

// console.log(process.env.DEVELOPMENT_ATLAS_URI)
// app.use(cors({
//   origin: 'http://127.0.0.1:5502', // replace with the actual origin of your frontend
//   credentials: true,
// }
// ))


 
  

// app.post('/createGame', async(req, res) => {
//   const data = req.body

//   if (data.playerKey && data.playerKey) {
//     res.json({ playerKey: null, gameKey:null }).status(200)
//     return
//   } else if (!data.playerKey && data.gameKey) {
//     res.json({ playerKey: data.playerKey , gameKey:null }).status(200)
//     return
//   } else if (data.playerKey && !data.gameKey) {
//     res.json({ playerKey: null , gameKey:data.gameKey }).status(200)
//     return
//   }
//   else {
//     const playerKey = Date.now().toString()
//     const playerName = data.playerName
//     const gameName = data.gameName
//     const options = data.options
//     if (!Boolean(db)) {
//       return res
//         .json({
//           playerKey: null,
//           error: 'Database connection not established',
//         }).status(500)
//     } 
//     const collection = db.collection('games');

    

//     const newGame = await collection.insertOne({
//       uniqKeyPlayer_1: playerKey,
//       uniqKeyPlayer_2: null,
//       game: 'waiting',
//       playerName,
//       gameName,
//       options,
//     })

//     if (newGame.insertedId) {
//       console.log({playerKey}) 
//       console.log(newGame.insertedId)
//       res.json({ playerKey, gameKey: newGame.insertedId}).status(200)
//     } else {
//       res.json({
//         playerKey: null,
//         error: 'Database connection not established',
//       }).status(500)
//     }
    
//   }
    
  
  
  
  

// })
 
// app.post('/deleteGame', async (req, res) => {
//   const  { playerKey, gameKey }  = req.body
  
//   if (!playerKey || !gameKey) {
//     res.json({ error: 'bad request' }).status(400)
//     return
//   } 
//   if (!Boolean(db)) {
//     return res
//       .json({
//         uniqKey: null,
//         error: 'Database connection not established',
//       }).status(500)
//   }
//   const collection = db.collection('games');

//   const gameStatus = await collection.findOne({_id: new ObjectId(gameKey)})
//   console.log(gameStatus.game)
//   console.log(gameKey)
//   switch (gameStatus.game) {
//     case 'playing':
//       await collection.updateOne(
//         { _id: new ObjectId(gameKey) },
//         { $set: { ['game']: 'closing' } }
//       )
//       break
//     default:
//       await collection.deleteOne(
//         { _id: new ObjectId(gameKey) }
//       )
//   }

//   res.send('ok').status(200)
  
// })








const PORT = process.env.PORT_EXPRESS_SERVER || 5500
app.listen(PORT, () => {
  console.log(`server is working on server ${PORT}`) 
})
