import { WebSocketServer, WebSocket } from "ws";
import EventEmitter from "events";
import { v1 } from "uuid";
import http from "http";
import isOnline from "is-online";
import { database, prepare } from "../mongo/db.js";
import {
  MessageSocket_E,
  Client_I,
  CreateGame_T,
  GameStatus_E,
  GameStatusConnect_T,
} from "./types.js";
import { strict } from "assert";
// import { handlerMessageGive, handlerMessageTake } from '../index.js'


enum GiveMessage_E {
  TOSTORAGE = 'tostorage',
  TOCONNECT = 'toconnect'
}



export class WebSocketHeandler {
  private wss: WebSocketServer;
  private clients: Map<any, any>;

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });
    this._initialNewClient();
    this.clients = new Map();
  }

  private _initialNewClient() {
    this.wss.on("connection", (ws, req) => {
      const client = this._criateClient();
      this.clients.set(client.playerKey, ws);
      this._disconect(ws);
      this._messageEvent(ws, client);
      this._closeEvent(ws, client);
    });
  }

  private _criateClient(): Client_I {
    const playerKey: string = v1();
    const gameKey: string = Date.now().toString();
    const newConnect = { playerKey, gameKey };
    return newConnect;
  }

  private _closeEvent(ws: WebSocket, client: Client_I) {
    ws.on("close", () => {
      this.takeMessDelete({ _id: client.gameKey });
      if (this.clients.has(client.playerKey)) {
        this.clients.delete(client.playerKey);
      }
    });
  }

  private async _messageEvent(ws: WebSocket, client: Client_I) {
    ws.on("message", async (message: string) => {
      const message_:
        | [MessageSocket_E.CREATE, CreateGame_T]
        | [MessageSocket_E.DELETE | MessageSocket_E.JOIN, { _id: string }] =
        JSON.parse(message);

      switch (message_[0]) {
        case MessageSocket_E.CREATE:
          await this.takeMessCreateGame(client, message_[1]);
          await this.giveMessCreateGame(ws, client);
          break;

        case MessageSocket_E.DELETE:
          await this.takeMessDelete(message_[1]);
          break;

        case MessageSocket_E.JOIN:
          await this.takeMessJoinGame(client, message_[1]);
          await this.giveMessJoinGame(ws, client, message_[1]);
          break;
      }
    });
  }

  private async _disconect(ws: WebSocket) {
    setInterval(() => {
      isOnline()
        .then((resp) => {
          if (resp) return;
          else ws.terminate();
        })
        .catch((err) => console.error("error checking of connection: ", err));
    }, 15000);
  }

  private _errorEvent(ws: WebSocket) {
    ws.on("error", (error: Error) => {
      console.error("this._error was worked");
    });
  }

  private async giveMessJoinGame(
    ws: WebSocket,
    client: Client_I,
    obj: { _id: string }
  ) {
    const gameStatus = await database.getOneField(obj, "gameStatus");
    const message1: [GiveMessage_E.TOSTORAGE, Client_I] = [
      GiveMessage_E.TOSTORAGE,
      {
        playerKey: client.playerKey,
        gameKey: obj._id, // send the same gameKey to second player
      },
    ];
    const message2: [GiveMessage_E.TOCONNECT, {}] = [
      GiveMessage_E.TOCONNECT,
      { gameStatus },
    ];
    await this.sendMessSecondPlayer(message1, client);
    await this.sendMessFirstPlayer(message2, client);

  }
  private giveMessCreateGame(ws: WebSocket, client: Client_I) {
    const message: [GiveMessage_E, Client_I] = [
      GiveMessage_E.TOSTORAGE,
      client,
    ];
    
    this._sendMessage(ws, message);
  }
  private async takeMessCreateGame(client: Client_I, obj: CreateGame_T) {
    const date = prepare.addUniqKeys(obj, client);
    await database.insertOne(date);
  }
  private async takeMessDelete(obj: { _id: string }) {
    const gameStatus = await database.getOneField(obj, "gameStatus");
    // console.log(gameStatus);
    switch (gameStatus) {
      case GameStatus_E.WAITING:
        await database.deleteOne(obj);
        break;
      case GameStatus_E.PLAYING:
        await database.updateOne(obj, {
          gameStatus: GameStatus_E.CLOSING,
        });
        break;
      case GameStatus_E.CLOSING:
        await database.deleteOne(obj);
        break;
      default:
        break;
    }
  }
  private async takeMessJoinGame(client: Client_I, obj: { _id: string }) {
    await database.updateOne(obj, {
      playerTwo: client.playerKey,
      gameStatus: GameStatus_E.PLAYING,
    });
    client.gameKey = obj._id; // assign the same gameKey to second player
    console.log("new number= ", client.gameKey);
  }

  private async sendMessFirstPlayer(
    message:
      | [GiveMessage_E.TOSTORAGE, Client_I]
      | [GiveMessage_E.TOCONNECT, {}],
    client: Client_I
  ) {
    const _id = { _id: client.gameKey };
    const playerOne = await database.getOneField(_id, "playerOne");
    this.sendMessCicle(message, playerOne);
  }
  private async sendMessSecondPlayer(
    message:
      | [GiveMessage_E.TOSTORAGE, Client_I]
      | [GiveMessage_E.TOCONNECT, {}],
    client: Client_I
  ) {
    const _id = { _id: client.gameKey };
    const playerTwo = await database.getOneField(_id, "playerTwo");
    this.sendMessCicle(message, playerTwo);
  }
  private sendMessCicle(
    message:
      | [GiveMessage_E.TOSTORAGE, Client_I]
      | [GiveMessage_E.TOCONNECT, {}],
    playerKey: string | null
  ) {
    this.clients.forEach((userWs: WebSocket, key: string) => {
      if (key === playerKey) {
        this._sendMessage(userWs, message);
      }
    });
  }
  public _sendMessage(
    ws: WebSocket,
    client: [GiveMessage_E.TOSTORAGE, Client_I] | [GiveMessage_E.TOCONNECT, {}]
  ) {
    ws.send(JSON.stringify(client));
  }
}

