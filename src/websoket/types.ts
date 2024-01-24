export enum MessageSocket_E {
  CREATE = "creategame",
}
enum Tic_tac_modes_E {
  ONE = "one",
  TWO = "two",
}
enum Winner_E {
  CROSS = "cross",
  ZERRO = "zerro",
}

export enum GameStaus_E {
  PLAYING = "playing",
  CLOSING = "closing",
  WAITING = "waiting",
}

interface Sell_I {
  key: string; // it is unique value that was generated via Math.random module
  index: number; // it shows current possition that counting from left to right and top to down
  type: boolean | null; // it shows who will be owner of the this sell, true it will be <cross> false it'll be <zerro>, the null means that till no one is owner
}

interface Mode_I {
  currentGame: Tic_tac_modes_E; // it shows current mode of game, at this moment the aviable modes are 3 to 3 sells, 5 to 5               <duplicate in server>
  sells: Sell_I[]; // it shows all sells                                                                                                  <duplicate in server>
}

interface TypeMarker_I {
  typeMarker: boolean; // it shows who must to make move, true means <cross> false means <zerro>                                          <duplicate in server>
}

interface Scope_I {
  // it shows scope between two players                                                                                                 <duplicate in server>
  scope: {
    [Winner_E.CROSS]: number;
    [Winner_E.ZERRO]: number;
  };
}

interface NoWinner_I {
  noWinner: boolean; // it shows is winner in game or not                                                                                 <duplicate in server>
}

interface LastWinner_I {
  lastWinner: null | Winner_E; //                                                                                                         <duplicate in server>
}

interface WinnerCombination_I {
  winnerCombination: number[]; // it shows winner combinations                                                                            <duplicate in server>
}




export interface Options_I
  extends Mode_I,
    TypeMarker_I,
    Scope_I,
    NoWinner_I,
    WinnerCombination_I,
    LastWinner_I {}

export type CreateGame_T = {
  gameName: string;
  playerOneName: string;
  options: Options_I;
};

export interface Client_I {
  playerKey: string;
  gameKey: string;
}

export interface GameData_I extends CreateGame_T {
  _id: string;
  playerOne: string | null;
  playerTwo: string | null;
  playerTwoName: string | null;
  gameStaus: GameStaus_E;
}