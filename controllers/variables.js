const gameMode = {
  PLAYING: 'playing',
  WAITING: 'waiting',
  CLOSING: 'closing',
}

const objResponse = {
  exist: {
    responce: {
      error:
      "uniq and keys are already existed in client",
    },
    status: 400
    
  },
  empty: {
    responce: [],
    status: 202
  },

  notExistClient: {
    responce: {
      error:
        "uniq and keys aren't existed in client"
      },
    status: 400
  },
  notExistDB: {
    responce: {
      error:
      "uniq and keys aren't in dataBase"
    },
    status: 400
  },
  delete: {
    response: {
      existing:
      "game was deleted from dataBase"
    },
    status: 200
    
  },
  dbInsertError: {
    responce: {
      error: 
      "can not insert new value in DB"
    },
    status: 400
  }
}

module.exports = {gameMode, objResponse}