
export enum GameMode_E {
  PLAYING = 'playing',
  WAITING = 'waiting',
  CLOSING = 'closing',
}



interface Error_I {
  responce: {
    error: string;
  };
  status: number;
}

export type ObjResponse_T = {
  exist: Error_I;
  empty: {
    responce: [];
    status: number;
  };
  notExistClient: Error_I;
  notExistDB: Error_I;
  delete: Error_I;
  dbInsertError: Error_I;
}


export const objResponse: ObjResponse_T = {
  exist: {
    responce: {
      error: "uniq and keys are already existed in client",
    },
    status: 400,
  },
  empty: {
    responce: [],
    status: 202,
  },
  notExistClient: {
    responce: {
      error: "uniq and keys aren't existed in client",
    },
    status: 400,
  },
  notExistDB: {
    responce: {
      error: "uniq and keys aren't in dataBase",
    },
    status: 400,
  },
  delete: {
    responce: {
      error: "game was deleted from dataBase",
    },
    status: 200,
  },
  dbInsertError: {
    responce: {
      error: "can not insert new value in DB",
    },
    status: 400,
  },
};

