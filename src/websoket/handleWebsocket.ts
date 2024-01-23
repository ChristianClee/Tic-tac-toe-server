import { WebSocketServer, WebSocket } from "ws";
import EventEmitter from "events"
import {v1} from "uuid"
import http from "http";
import isOnline from 'is-online'
import { error } from "console";



interface Client_I {
  playerKey: string;
  gameKey: string;
}
enum MessageSocket_E {
  CONNECTION = "connection",
  GETKEYS = "getkeys",
}


class Clients {
  public games: any[];
  public game: { playerKey: string; gameKey: string } | null

  constructor() {
    this.games = [];
    this.game = null
  }
}

const myEmitter = new EventEmitter();

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
      this._disconect(ws)
      // const client = this._errorEvent(ws);
      this._messageEvent(ws, client);
      this._closeEvent(ws, client);
    });
  }

  private _addClientToList(client: Client_I) {
    this.clients.push(client);
    console.log(this.clients);
  }
  private _criateClient(): Client_I {
    const playerKey: string = v1();
    const gameKey: string = Date.now().toString();
    const newConnect = { playerKey, gameKey };
    return newConnect;
  }
  private _closeEvent(ws: WebSocket, client: Client_I) {
    ws.on("close", () => {
      this.clients = this.clients.filter((i) => {
        const _i = JSON.stringify(i);
        const _client = JSON.stringify(client);
        return _i !== _client;
      });
      console.log(this.clients);
    });
  }
  private _messageEvent(ws: WebSocket, client: Client_I) {
    ws.on("message", (message) => {
      const message_ = message.toString();
      switch (message_) {
        case MessageSocket_E.GETKEYS:
          this._addClientToList(client);
          this._sendMessage(ws, client);
      }
    });
  }
  private async _disconect(ws: WebSocket) {
    setInterval(() => {
      isOnline()
        .then((resp) => {
          if (resp) return
          else ws.terminate();
        })
        .catch((err) =>
          console.error("error checking of connection: ", error)
        );
    }, 15000)

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


  // const checkInternetConnection = async () => {
  //   try {
  //     const online = await isOnline();
  //     if (!online) {
  //       console.log(
  //         "Интернет-соединение потеряно. Закрываем WebSocket соединение."
  //       );
  //       ws.terminate(); // Закрываем соединение
  //     }
  //   } catch (error) {
  //     console.error("Ошибка при проверке интернет-соединения:", error);
  //   }
  // };