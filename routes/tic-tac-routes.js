const Router = require('express')
const router = new Router()
const ticTacController = require('../controllers/tic-tac-controller')


router.post('/createGame', ticTacController.createGame)

module.exports = router