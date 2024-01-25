import { WebSocketServer, WebSocket } from "ws";
import EventEmitter from "events";
import { v1 } from "uuid";
import http from "http";
import isOnline from "is-online";
import { database, prepare } from "../mongo/db.js";

import {
  Options_I,
  MessageSocket_E,
  Client_I,
  CreateGame_T,
  GameStatus_E,
} from "./types.js";
// import { handlerMessageGive, handlerMessageTake } from '../index.js'


export class WebSocketHeandler {
  private wss: WebSocketServer;
  public clients: any[];

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });
    this._initialNewClient();
    this.clients = [];
  }

  private _initialNewClient() {
    this.wss.on("connection", (ws, req) => {
      const client = this._criateClient();
      // console.log( 'created',  client);
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
          this.takeMessCreateGame(client, message_[1]);
          this.giveMessCreateGame(ws, client, message_[1]);
          break;

        case MessageSocket_E.DELETE:
          this.takeMessDelete(message_[1]);
          break;

        case MessageSocket_E.JOIN:
          this.takeMessJoinGame(client, message_[1]);
          this.giveMessJoinGame(ws, client, message_[1]);
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

  public _sendMessage(ws: WebSocket, client: Client_I) {
    ws.send(JSON.stringify(client));
  }
  private giveMessJoinGame(
    ws: WebSocket,
    client: Client_I,
    obj: { _id: string }
  ) {
    this._sendMessage(ws, {
      playerKey: client.playerKey,
      gameKey: obj._id,
    });
  }
  private giveMessCreateGame(
    ws: WebSocket,
    client: Client_I,
    obj: CreateGame_T
  ) {
    this._sendMessage(ws, client);
  }
  private async takeMessCreateGame(client: Client_I, obj: CreateGame_T) {
    const date = prepare.addUniqKeys(obj, client);
    await database.insertOne(date);
  }
  public async takeMessDelete(obj: { _id: string }) {
    const gameStatus = await database.getOneField(obj, "gameStatus");
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
    }
  }
  public async takeMessJoinGame(client: Client_I, obj: { _id: string }) {
    await database.updateOne(obj, {
      playerTwo: client.playerKey,
      gameStatus: GameStatus_E.PLAYING,
    });
    client.gameKey = obj._id;
  }
}

