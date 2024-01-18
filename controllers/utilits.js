const { MongoClient, ObjectId } = require('mongodb');
const chalk = require('chalk')
const { gameMode, objResponse } = require('./variables')


class Utilits{

  async createGame(req) {
    const dataBase = new DataBase()
    const matching = new Matching()
    const value = new Values()
    const data = req.body
    
    const isEmpty = matching.isExist(data.playerKey, data.gameKey ) // if data.playerKey or data.gameKey is exist, new keys won't generate 
    if (isEmpty) return {
      responce: objResponse.exist.responce,
      status: objResponse.exist.status} // !!! fail request client

    const val = value.getValue(data)
    const newGame = await dataBase.insertOne(val)
    if (!newGame) return {
      responce: objResponse.dbInsertError.responce,
      status: objResponse.dbInsertError.status
    } // !!! fail responce db

    const responce = { playerKey:val.uniqKeyPlayer_1 , gameKey: newGame.insertedId }
    return {responce, status: 200} // * sucsess response 
  }

  async deleteGame(req) {
    const dataBase = new DataBase()
    const matching = new Matching()

    const data = req.body
    const isEmpty = matching.isExist(!data.playerKey, !data.gameKey)    
    if (isEmpty) return {
      response: objResponse.notExistClient.responce,
      status: objResponse.notExistClient.status
    } // !!! fail request client

    const findQury = { _id: new ObjectId(data.gameKey) }
    const chengeField = { $set: { ['game']: gameMode.CLOSING } }
    
    const dataRequest = await dataBase.findOne(findQury)
    if (!dataRequest) return {
      response: objResponse.notExistDB.responce,
      status: objResponse.notExistDB.status
    } // !!! fail responce db
    

    switch (dataRequest) {  
      case gameMode.PLAYING:
        await dataBase.updateOne(findQury, chengeField)
        break
      default:
        await dataBase.deleteOne(findQury)
    }
    return {
      response: objResponse.delete.response,
      status: objResponse.delete.status
    } // * sucsess response 
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

}

class Values {
  getUniqString() {
    return Date.now().toString()
  }

  getValue(data) {
    return {
      uniqKeyPlayer_1: this.getUniqString(),
      uniqKeyPlayer_2: null,
      game: 'waiting',
      playerName: data.playerName,
      gameName: data.gameName,
      options: data.options,
    }
  }
}

class Sending extends Utilits{
  constructor() {
    super()
  }

  sendJson(res, data) {
    try { 
      const resData = { ...data.responce }
      res.json(resData).status(data.status)
      console.log(resData)
    }
    catch (error) {
      this.errorMessage(res, error, data)
    }
  }

  errorMessage(res, error, data) {
    console.error({ error: `errorMessage=${error}, data=${data}` })
    res.json({ error: `server error check "errorMessage"` }).status(400)
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
    await this.openCloseConnect(
      async (db) => {
        try {
          result = await this.collection(db).insertOne(value)
        }
        catch (e) {
          console.error(e)
          result = false
        }
      }
    ) 
    return result
  }

  async findOne(findQury) {
    let result
    await this.openCloseConnect(async (db) => {
      try {
        result = await this.collection(db).findOne(findQury)
      } catch(err) {
        console.error(err)
        result = false
      }
      
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
const sending = new Sending()

module.exports = { utilits, sending }
