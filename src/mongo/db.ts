import { config } from "dotenv";
config();
import { MongoClient, Db } from "mongodb";
import {
  CreateGame_T,
  Client_I,
  Game_status_E,
  MessageSocket_E,
} from "../websoket/types.js";





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
      console.error('error open close', error)
    } finally {
      await this.client.close();
    }
  }
}

class DataBase extends Connecting {
  constructor() {
    super();
  }

  public async insertOne(value: CreateGame_T) {
    let result;
    await this.openCloseConnect(async (db) => {
      try {
        //@ts-ignore
        result = await this.collection(db).insertOne(value);
      } catch (e) {
        console.error("error Insert db ", e);
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

  async find(findQury: any) {
    let result: CreateGame_T[] | [];
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

  async getOneField(id: { _id: string }, name: string) {
    const findQur = { projection: { _id: 0, [name]: 1 } };
    let result: string | null;
    await this.openCloseConnect(async (db) => {
      try {
        // @ts-ignore
        const responce = await this.collection(db).findOne(id, findQur);
        // @ts-ignore
        result = responce[name];
      } catch (e) {
        console.error("Error in data base method <getOneField>");
        result = null;
      }
    });
    //@ts-ignore
    return result;
  }

  async findOne(id: { _id: string }) {
    let result: {};
    await this.openCloseConnect(async (db) => {
      try {
        // @ts-ignore
        const responce = await this.collection(db).findOne(id);
        console.log('responce');
        // @ts-ignore
        result = responce;
      } catch (e) {
        console.error("Error in data base method <findOne>");
        result = {};
      }
    });
    //@ts-ignore
    return result;
  }

  async updateOne(findQury: { _id: string }, chengeFields: {}) {
    const chengeFields_ = { $set: chengeFields };
    let result;
    await this.openCloseConnect(async (db) => {
      //@ts-ignore
      result = await this.collection(db).updateOne(findQury, chengeFields_);
      console.log("updateOne");
    });
    return result;
  }

  async deleteOne(findQury: { _id: string }) {
    let result;
    
    await this.openCloseConnect(async (db) => {
      try {
        //@ts-ignore
        result = await this.collection(db).deleteOne(findQury);
        console.log("result", result);
       }
      catch(e) {
        console.error("result", e);
       }
      
      
    });
    return result;
  }

  private collection(db: Db) {
    return db.collection("games");
  }
}

class Prepere {
  constructor() {}

  public addUniqKeys(gameDate: CreateGame_T, uniqKeys: Client_I): CreateGame_T {
    const result = {
      ...gameDate,
      _id: uniqKeys.gameKey,
      playerOne: uniqKeys.playerKey,
      playerTwo: null,
      gameStatus: Game_status_E.WAITING,
    };
    return result;
  }

  public getCurrentVaslue(data: CreateGame_T[], arg: string[]) {
    let result: any[] = [];
    data.map((item) => {
      let obj = {};
      arg.forEach(
        (elem) =>
          // @ts-ignore
          (obj = { ...obj, [elem]: item[elem] })
      );
      result.push(obj);
    });
    return result.map((item) => {
      return { ...item, time: this.getTime(item._id) };
    });
  }

  private getTwo(val: string | number) {
    let res = String(val);
    return res.length < 2 ? "0" + res : res;
  }

  private getTime(str: string): string {
    const num: number = parseInt(str);
    const date = new Date(num);
    let hour = this.getTwo(date.getHours());
    let minuet = this.getTwo(date.getMinutes());
    let second = this.getTwo(date.getSeconds());
    return `${hour}:${minuet}:${second}`;
  }
}

export const prepare = new Prepere;
export const database = new DataBase();
