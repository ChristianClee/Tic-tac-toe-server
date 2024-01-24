import { Request, Response } from "express";
// import { utilits, sending } from "./utilits.js";
import { database,prepare } from "../mongo/db.js"
import {GameData_I} from "../websoket/types.js"


class TicTacController {
  async getAllGame(req: Request, res: Response) {
    const data = await database.find({});
    prepare.getCurrentVaslue(data, ["gameName", "_id"]);
    res.json(data).status(200);
  }
}

export const ticTacController = new TicTacController();
