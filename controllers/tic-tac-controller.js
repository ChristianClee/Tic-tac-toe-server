const { MongoClient, ObjectId } = require('mongodb');
const chalk = require('chalk')


const mongoUrl = process.env.DEVELOPMENT_ATLAS_URI;
// console.log(mongoUrl)
const client = new MongoClient(mongoUrl);

let connectDb
let db
connecting()
 

async function connecting() {
  try {
    connectDb = await client.connect()
    db = connectDb.db()
    console.log(chalk.blue("connecting"))
  } catch (e) {
    console.log(chalk.red('no connect'))
    connectDb = null
  }
}

class TicTacController{
  async createGame(req, res) {
    const data = req.body

    if (data.playerKey && data.playerKey) {
      res.json({ playerKey: null, gameKey:null }).status(200)
      return
    } else if (!data.playerKey && data.gameKey) {
      res.json({ playerKey: data.playerKey , gameKey:null }).status(200)
      return
    } else if (data.playerKey && !data.gameKey) {
      res.json({ playerKey: null , gameKey:data.gameKey }).status(200)
      return
    }
    else {
      const playerKey = Date.now().toString()
      const playerName = data.playerName
      const gameName = data.gameName
      const options = data.options
      if (!Boolean(db)) {
        return res
          .json({
            playerKey: null,
            error: 'Database connection not established',
          }).status(500)
      } 
      const collection = db.collection('games');

      

      const newGame = await collection.insertOne({
        uniqKeyPlayer_1: playerKey,
        uniqKeyPlayer_2: null,
        game: 'waiting',
        playerName,
        gameName,
        options,
      })

      if (newGame.insertedId) {
        console.log({playerKey}) 
        console.log(newGame.insertedId)
        res.json({ playerKey, gameKey: newGame.insertedId}).status(200)
      } else {
        res.json({
          playerKey: null,
          error: 'Database connection not established',
        }).status(500)
      }
      
    }
      
    
  }
  async deleteGame(req, res) {
    const  { playerKey, gameKey }  = req.body
    
    if (!playerKey || !gameKey) {
      res.json({ error: 'bad request' }).status(400)
      return
    } 
    if (!Boolean(db)) {
      return res
        .json({
          uniqKey: null,
          error: 'Database connection not established',
        }).status(500)
    }
    const collection = db.collection('games');

    const gameStatus = await collection.findOne({_id: new ObjectId(gameKey)})
    console.log(gameStatus.game)
    console.log(gameKey)
    switch (gameStatus.game) {
      case 'playing':
        await collection.updateOne(
          { _id: new ObjectId(gameKey) },
          { $set: { ['game']: 'closing' } }
        )
        break
      default:
        await collection.deleteOne(
          { _id: new ObjectId(gameKey) }
        )
    }

    res.send('ok').status(200)
    
}
}

module.exports = new TicTacController()