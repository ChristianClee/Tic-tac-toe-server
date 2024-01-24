import { config } from "dotenv";
config();
import { MongoClient, Db } from "mongodb";

import { CreateGame_T, Client_I, GameData_I, GameStaus_E } from "../websoket/types.js";
import { strict } from "assert";




class Connecting {
  private mongoUrl: string;
  private client: MongoClient;

  constructor() {
    this.mongoUrl = process.env.ATLAS_URI || ""; // data base takin in env.ATLAS_URI
    this.client = new MongoClient(this.mongoUrl);
  }

  public async openCloseConnect(func: (db: Db) => void) {
    try {
      await this.client.connect(); // Open connection
      const db = this.client.db(); // Open data base
      await func(db); // Execute operation on BD
    } catch (error) {
    } finally {
      await this.client.close();
    }
  }
}

class DataBase extends Connecting {
  constructor() {
    super();
  }

  public async insertOne(value: GameData_I) {
    let result;
    await this.openCloseConnect(async (db) => {
      try {
        //@ts-ignore
        result = await this.collection(db).insertOne(value);
      } catch (e) {
        console.error('error Insert db ', e);
        result = false;
      }
    });
    return result;
  }

  // async findOne(findQury) {
  //   let result;
  //   await this.openCloseConnect(async (db) => {
  //     try {
  //       result = await this.collection(db).findOne(findQury);
  //     } catch (err) {
  //       console.error(err);
  //       result = false;
  //     }
  //   });
  //   return result;
  // }

  async find(findQury:any) {
    let result: GameData_I[] | [];
    await this.openCloseConnect(async (db) => {
      try {
        //@ts-ignore
        result = await this.collection(db).find(findQury).toArray();
      } catch (e) {
        console.error("Error in data base method <find>");
        result = [];
      }
    });
    //@ts-ignore
    return result;
  }

  // async updateOne(findQury, chengeField) {
  //   let result;
  //   await this.openCloseConnect(async (db) => {
  //     result = await this.collection(db).updateOne(findQury, chengeField);
  //   });
  //   return result;
  // }

  async deleteOne(findQury:{_id: string}) {
    let result;
    await this.openCloseConnect(async (db) => {
      //@ts-ignore
      result = await this.collection(db).deleteOne(findQury);
    });
    return result;
  }

  private collection(db: Db) {
    return db.collection("games");
  }
}

class Prepere {
  constructor() {}

  addUniqKeys(gameDate: CreateGame_T, uniqKeys: Client_I): GameData_I {
    const result = {
      ...gameDate,
      _id: uniqKeys.gameKey,
      playerOne: uniqKeys.playerKey,
      playerTwo: null,
      gameStaus: GameStaus_E.WAITING,
      playerTwoName: null
    };
    return result;
  }

  getCurrentVaslue(data: GameData_I[], arg: string[]) {
    let result: any[] = []
    data.map(item => {
      let obj = {} 
      arg.forEach(elem => (
        //@ts-ignore
        obj = {...obj, [elem]: item[elem] }
      ))
      result.push(obj);
    })

    result.map(item => {
      // const get time = item._id
    })


  }
}

export const prepare = new Prepere;
export const database = new DataBase();
