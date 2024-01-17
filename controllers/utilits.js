const { MongoClient, ObjectId } = require('mongodb');
const chalk = require('chalk')
const { gameMode } = require('./variables')

class Utilits {
  createGame(req, res) {
    return async (db) => {
      await utilitsInner.createGame(db, req, res)
    }
  }

  deleteGame(req, res) {
    return async (db) => {
      await utilitsInner.deleteGame(db, req, res)
    }
  }

  aviableGame(req, res) {
    return async (db) => {
       await utilitsInner.aviableGame(db, req, res)
    }
  }

  

  

}

class UtilitsInner{

  async createGame(db, req, res) {
    const dataBase = new DataBase(db)
    const sending = new Sending(res)
    const matching = new Matching()

    const data = req.body
    
    const isEmpty = matching.isExist(data.playerKey, data.gameKey ) // if data.playerKey or data.gameKey is exist, new keys won't generate
    if (isEmpty) {
      sending.sendExisting()
      return
    }  
    else {
      // const collection = db.collection('games');
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

      const newGame = await dataBase.insertOne(value) // newGame is _id of element
      const dataToFront = { playerKey, gameKey: newGame.insertedId}
      sending.sendJson(dataToFront)
    }
  }
  async deleteGame(db, req, res) {
    const dataBase = new DataBase(db)
    const sending = new Sending(res)
    const matching = new Matching()

    const data = req.body
    const isEmpty = matching.isExist(!data.playerKey, !data.gameKey)
    
    if (isEmpty) {
      sending.sendNotExisting()
      return 
    } 

      const findQury = { _id: new ObjectId(data.gameKey) }
      const chengeField = { $set: { ['game']: gameMode.CLOSING } }
      const gameStatus = (await dataBase.findOne(findQury)).game
      switch (gameStatus) {
        case gameMode.PLAYING:
          await dataBase.updateOne(findQury, chengeField)
          break
        default:
          await dataBase.deleteOne(findQury)
      // res.send('ok').status(200)
      }
      console.log(chalk.green('finish'))
    
  }
  async aviableGame(db, req, res) {
    const dataBase = new DataBase(db)
    const sending = new Sending(res)

    const dataToFront = await dataBase.find({})
    sending.sendJson( dataToFront)

  }
}

class Matching {

  isExist(playerKey, gameKey) {
    const condition = playerKey || gameKey
    if (condition) {
      return true
    }
    return false
  }
}

class DataBase{
  constructor(db) {
    this.db = db
    this.collection = this.db.collection('games')
  }
  async insertOne( value) {
    const result = await this.collection.insertOne(
      value
    )
    return result
  }
  async findOne(findQury) {
    const result = await this.collection.findOne(
      findQury
    )
    return result
  }
  async find(findQury) {
    const result = await this.collection.find(
      findQury
    ).toArray()
    return result
  }
  async updateOne( findQury, chengeField) {
    const result = await this.collection.updateOne(
      findQury,
      chengeField
    )
    return result
  }
  async deleteOne(findQury) {
    const result = await this.collection.deleteOne(
      findQury
    )
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

class Sending{
  constructor(res) {
    this.res = res
  }
  sendJson(data) {
    try { 
      this.res.json({...data}).status(200)
    }
    catch (error) {
      this.errorMessage(error)
    }
  }

  sendExisting() {
    try { 
      this.res.json({existing:"uniq and keys are already existed in client"}).status(200)
    }
    catch (error) {
      this.errorMessage(res, error)
    }
  }

  sendNotExisting() {
    try { 
      this.res.json({existing:"uniq and keys are't  existed in client"}).status(200)
    }
    catch (error) {
      this.errorMessage(res, error)
    }
  }

  errorMessage(res,error) {
    console.error({ error: `sending error ${error}` })
    res.json({ error: `sending error ${error}` }).status(400)
  }


}


const utilits = new Utilits()
const utilitsInner = new UtilitsInner()
const connecting = new Connecting()
// const sending = new Sending()
// const matching = new Matching()
module.exports = {utilits, connecting}
