const { MongoClient, ObjectId } = require('mongodb');
const chalk = require('chalk')
const { gameMode } = require('./variables')


class Utilits{

  async createGame(req, res) {
    const dataBase = new DataBase()
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
  async deleteGame(req, res) {
    const dataBase = new DataBase()
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
    
    const dataRequest = (await dataBase.findOne(findQury))    
    const gameStatus = matching.isInObject('game', dataRequest)

    if (!gameStatus) return

  
    switch (gameStatus) { 
      case gameMode.PLAYING:
        await dataBase.updateOne(findQury, chengeField)
        break
      default:
        await dataBase.deleteOne(findQury)
    }

    
  }
  async aviableGame(req, res) {
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

  isObject(obj) {
    return Object.prototype.isPrototypeOf(obj)
  }

  isInObject(str, obj) {
    const cond1 = 'string' === typeof(str)
    const cond2 = this.isObject(obj)
    
    if (cond1 && cond2) {
      if (str in obj) {    
        return obj[str]
      } else {
        return false
      }
    } else {
      return false
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
class Connecting {
  constructor() {
    this.mongoUrl = process.env.ATLAS_URI; // data base takin in env.ATLAS_URI
    this.client = new MongoClient(this.mongoUrl);
  }
  async openCloseConnect(func) {
    try {
      await this.client.connect(); // Open connection
      const db = this.client.db(); // Open data base
      await func(db) // Execute operation on BD
    } catch (error) {
      console.error(chalk.red("connection is't opened, ",error)) 
    } finally {
      await this.client.close()
    }
  }
}

class DataBase extends Connecting{
  constructor() {
    super()
  }

  async insertOne(value) {
    let result
    await this.openCloseConnect(async (db) => {
      result = await this.collection(db).insertOne(value)
    }) 
    return result
  }

  async findOne(findQury) {
    let result
    await this.openCloseConnect(async (db) => {
      result = await this.collection(db).findOne(findQury)
    })
    return result
  }

  async find(findQury) {
    let result
    await this.openCloseConnect(async (db) => {
      result = await this.collection(db).find(findQury).toArray()
    })
    return result
  }

  async updateOne(findQury, chengeField) {
    let result
    await this.openCloseConnect(async (db) => { 
      result = await this.collection(db).updateOne(findQury,chengeField)
    })
    return result

  }

  async deleteOne(findQury) {
    let result
    await this.openCloseConnect(async (db) => { 
      result = await this.collection(db).deleteOne(findQury)
    })
    return result
  }

  collection(db) {
    return db.collection('games')
  }
}



const utilits = new Utilits()
module.exports = { utilits }
