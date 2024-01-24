import express, { Router } from 'express'
import { ticTacController } from '../controllers/tic-tac-controller.js'

export const router: Router = express.Router();




router.get("/getAllGame", ticTacController.getAllGame);



// module.exports = router