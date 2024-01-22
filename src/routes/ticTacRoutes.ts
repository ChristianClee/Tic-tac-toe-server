import express, { Router } from 'express'
import { ticTacController } from '../controllers/tic-tac-controller.ts'

export const router: Router = express.Router();


router.post('/createGame', ticTacController.createGame)
router.post('/deleteGame', ticTacController.deleteGame)
router.get('/aviableGame', ticTacController.aviableGame)



// module.exports = router