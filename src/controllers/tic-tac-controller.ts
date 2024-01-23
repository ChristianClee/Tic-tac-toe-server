import { Request, Response } from "express";
import { utilits, sending } from "./utilits.js";




class TicTacController {
  async createGame(req: Request, res: Response) {
    // post method

  }

  async deleteGame(req: Request, res: Response) {
    // post method

  }

  async aviableGame(req: Request, res: Response) {
    // get method

  }
}

export const ticTacController = new TicTacController();
