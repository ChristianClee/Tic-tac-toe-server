const { utilits, connecting } = require('./utilits')


class TicTacController{

  async createGame(req, res) {
    connecting.openCloseConnect(utilits.createGame(req, res))
  }

  async deleteGame(req, res) {
    connecting.openCloseConnect(utilits.deleteGame(req, res))
  }
  
  async aviableGame(req, res) {
    connecting.openCloseConnect(utilits.aviableGame(req, res))
  }
}

module.exports = new TicTacController()