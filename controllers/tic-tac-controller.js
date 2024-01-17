const { utilits } = require('./utilits')


class TicTacController{

  async createGame(req, res) {
    utilits.createGame(req, res)
  }

  async deleteGame(req, res) {
    utilits.deleteGame(req, res)
  }
  
  async aviableGame(req, res) {
    utilits.aviableGame(req, res)
  }
}

module.exports = new TicTacController()