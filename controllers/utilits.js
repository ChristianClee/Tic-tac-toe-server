const { MongoClient, ObjectId } = require('mongodb');
const chalk = require('chalk')
const { gameMode } = require('./variables')

class Utilits {
  createGame(req, res) {
    return async (db) => {
      await this.createGameInner(db, req, res)
    }
  }

  deleteGame(req, res) {
    return async (db) => {
      await this.deleteGameInner(db, req, res)
    }
  }

  aviableGame(req, res) {
    return async (db) => {
      await this.aviableGameInner(db, req, res)
    }
  }

  async createGameInner(db, req, res) {
    const data = req.body
      const isEmpty = matching.isEmpty(data.playerKey, data.gameKey, res) // if data.playerKey or data.gameKey is exist, new keys won't generate
      if (isEmpty) return      
      else {
        const collection = db.collection('games');
        const playerKey = Date.now().toString()
        const playerName = data.playerName
        const gameName = data.gameName
        const options = data.options

        const value = {
          uniqKeyPlayer_1: playerKey,
          uniqKeyPlayer_2: null,
          game: 'waiting',
          playerName,
          gameName,
          options,
        }
      
        try {
          const newGame = await dataBase.insertOne(collection, value) // newGame is _id of element
          res.json({ playerKey, gameKey: newGame.insertedId}).status(200)
        } catch (err) {
          res.json({ playerKey: null, gameKey: null, error: err.message}).status(400)
        }      
      }
  }
  async deleteGameInner(db, req, res) {
    const { playerKey, gameKey } = req.body
    // console.log(chalk.green('playerKey =', playerKey, 'gameKey = ', gameKey ))
    
    if (!playerKey || !gameKey) {
      res.json({ error: 'bad request' }).status(400)
      return 
    } else {
      const collection = db.collection('games');

      const findQury = { _id: new ObjectId(gameKey) }
      const chengeField = { $set: { ['game']: gameMode.CLOSING } }
      const gameStatus = (await dataBase.findOne(collection, findQury)).game
      // console.log(chalk.green('start'))

      switch (gameStatus) {
        case gameMode.PLAYING:
          await dataBase.updateOne(collection, findQury, chengeField)
          break
        default:
          await dataBase.deleteOne(collection, findQury)
      res.send('ok').status(200)
      }
      console.log(chalk.green('finish'))
    } 
  }
  async aviableGameInner(db, req, res) {
    
  }

}

class Matching{
  isEmpty(playerKey, gameKey, res) {
    if (playerKey && gameKey) {
      res.json({ playerKey: null, gameKey:null }).status(200)
      return true
    } else if (!playerKey && gameKey) {
      res.json({ playerKey: data.playerKey , gameKey:null }).status(200)
      return true
    } else if (playerKey && !gameKey) {
      res.json({ playerKey: null , gameKey:data.gameKey }).status(200)
      return true
    }
    return false
  }
}

class DataBase{
  async insertOne(collection, value) {
    const result = await collection.insertOne(value)
    return result
  }
  async findOne(collection) {
    const result = await collection.findOne()
    return result
  }
  async updateOne(collection, findQury, chengeField) {
    const result = await collection.updateOne(
      findQury,
      chengeField
    )
    return result
  }
  async deleteOne(collection, findQury ) {
    const result = await collection.deleteOne(
      findQury
    )
    console.log("here")
    return result
  }
}

class Connecting{
  constructor() {
    this.mongoUrl = process.env.ATLAS_URI; // data base takin in env.ATLAS_URI
    this.client = new MongoClient(this.mongoUrl);
  }
  async openCloseConnect(func) {
    try {
      await this.client.connect(); // Open connection
      const db = this.client.db(); // Open data base
      console.log(chalk.cyan('connection is opened'))
      await func(db) // Execute operation on BD
    } catch (error) {
      console.log(chalk.red('error ' , error)) 
    }finally {
      await this.client.close(); // Закрываем соединение в блоке finally, чтобы гарантировать, что соединение закроется независимо от того, произошло исключение или нет
      console.log(chalk.cyan('connection is closed'))
    }
  }
}


const utilits = new Utilits()
const connecting = new Connecting()
const dataBase = new DataBase()
const matching = new Matching()
module.exports = {utilits, connecting}
