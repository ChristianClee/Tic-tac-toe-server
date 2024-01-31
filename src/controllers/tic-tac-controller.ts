import { Request, Response } from "express";
// import { utilits, sending } from "./utilits.js";
import { database,prepare } from "../mongo/db.js"
import { Game_status_E} from "../websoket/types.js"


class TicTacController {
  async getAllGame(req: Request, res: Response) {
    const data = await database.find({});
    let games = prepare.getCurrentVaslue(data, ["gameName", "gameStatus" ,"_id"]);
    games = games.filter((i) => i["gameStatus"] === Game_status_E.WAITING);
    res.json(games).status(200);
  }
}

export const ticTacController = new TicTacController();
