import { WebSocketServer, WebSocket } from "ws";
import EventEmitter from "events";
import { v1 } from "uuid";
import http from "http";
import isOnline from "is-online";
import { error } from "console";
import { database, prepare } from "../mongo/db.js";

import { Options_I, MessageSocket_E, Client_I, GameData_I } from "./types.js";












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
      console.log( 'created',  client);
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
      database.deleteOne({ _id: client.gameKey });
    });
    
  }
  private async _messageEvent(ws: WebSocket, client: Client_I) {
    ws.on("message", async (message: string) => {
      const message_: [MessageSocket_E, any] = JSON.parse(message);
      
      switch (message_[0]) {
        case MessageSocket_E.CREATE:
          const date = prepare.addUniqKeys(message_[1], client);
          const res = await database.insertOne(date);
          if(res){
            this._sendMessage(ws, client);
          }
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
        .catch((err) => console.error("error checking of connection: ", error));
    }, 15000);
  }
  private _errorEvent(ws: WebSocket) {
    ws.on("error", (error: Error) => {
      console.error("this._error was worked");
    });
  }
  private _sendMessage(ws: WebSocket, client: Client_I) {
    ws.send(JSON.stringify(client));
  }
}
