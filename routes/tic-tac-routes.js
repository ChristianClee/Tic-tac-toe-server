const Router = require('express')
const router = new Router()
const ticTacController = require('../controllers/tic-tac-controller')




router.post('/createGame', ticTacController.createGame)
router.post('/deleteGame', ticTacController.deleteGame)

router.get('/aviableGame', ticTacController.aviableGame)

module.exports = router