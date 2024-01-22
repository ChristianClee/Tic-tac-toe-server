import { WebSocketServer, WebSocket } from "ws";
import {v1} from "uuid"
import http from "http";




class Clients {
  public games: any[];
  public game: { playerKey: string; gameKey: string } | null

  constructor() {
    this.games = [];
    this.game = null
  }
}


export class WebSocketHeandler {
  private wss: WebSocketServer;
  private client: { playerKey: string; gameKey: string } | null;
  public clients: any[];

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });
    this.client = null;
    this._initialNewClient();
    this.clients = [];
  }

  private _initialNewClient() {
    this.wss.on("connection", (ws, req) => {
      const client = Date.now().toString();
      this._close(ws, client);
      this._message(ws);
      this._error(ws);
    });
  }

  private _newConnect() {
    const playerKey: string = v1();
    const gameKey: string = Date.now().toString();

    const newConnect = { playerKey, gameKey };
    this.client = newConnect;
    this.clients.push(this.client);
    console.log(this.clients);
  }

  private _close(ws: WebSocket, client: string) {
    ws.on("close", () => {
      this.clients = this.clients.filter((i) => {
        const _i = JSON.stringify(i);
        const _client = JSON.stringify(this.client);
        return _i !== _client;
      });
    });
  }

  private _message(ws: WebSocket) {
    ws.on("message", (message) => {
      if (message.toString()) {
        this._newConnect();
        this._sendMessage(ws);
      }
    });
  }

  private _error(ws: WebSocket) {
    ws.on("error", (error: Error) => {
      console.error("this._error was worked");
    });
  }

  private _sendMessage(ws: WebSocket) {
    const playerKey = this.client;
    ws.send(JSON.stringify(playerKey));
  }

  private _checkInternetConnection() {

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