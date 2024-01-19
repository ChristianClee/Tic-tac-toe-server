const { utilits, sending } = require('./utilits')


class TicTacController{

  async createGame(req, res) {
    // post method
    const result = await utilits.createGame(req)
    sending.sendJson(res, result)
  }

  async deleteGame(req, res) {
    // post method
    const result = await utilits.deleteGame(req)
    sending.sendJson(res, result)
  }
  
  async aviableGame(req, res) {
    // get method
    const result = await utilits.aviableGame()
    sending.sendJson(res, result)
  }
}

module.exports = new TicTacController()