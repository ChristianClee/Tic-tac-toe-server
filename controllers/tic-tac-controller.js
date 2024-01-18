const { utilits, sending } = require('./utilits')
// const {objResponse} = require('./variables')

class TicTacController{

  async createGame(req, res) {
    const result = await utilits.createGame(req)
    sending.sendJson(res, result)
  }

  async deleteGame(req, res) {
    const result = await utilits.deleteGame(req)
    sending.sendJson(res, result)
  }
  
  async aviableGame(req, res) {
    const result = await utilits.aviableGame(req)
  }
}

module.exports = new TicTacController()