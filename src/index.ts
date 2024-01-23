"use strict"
import { config } from 'dotenv'
import cookieParser from "cookie-parser";
import http from 'http'
import { WebSocketServer } from "ws";
import  express from "express";
import cors from "cors";
import { router } from "./routes/ticTacRoutes.js";
import { WebSocketHeandler } from "./websoket/handleWebsocket.js";




config();
const app = express() 
const server = http.createServer(app);
const webSocketHeandler = new WebSocketHeandler(server)

app.use(cors())
app.use(express.json())

// const wss = new WebSocketServer({ server });
// app.use(cookieParser())
app.use("", router);   
app.get('/', (req, res) => {
})


// wss.on("connection", (ws, req) => {
//   const clientId = Date.now().toString();
//   clients[clientId] = 'sd'
//   ws.on("open", () => { });
//   console.log(wss.clients.size);
  

//   ws.on("message", (message) => {
//     console.log(`Received: ${message}`);
//   }); 

//   ws.on("close", () => {
//     console.log("WebSocket соединение закрыто");

//     delete clients[clientId];
//     console.log(clients)
//     // clients.map()
//   });
//   // const checkInternetConnection = async () => {
//   //   try {
//   //     const online = await isOnline();
//   //     if (!online) {
//   //       console.log(
//   //         "Интернет-соединение потеряно. Закрываем WebSocket соединение."
//   //       );
//   //       ws.terminate(); // Закрываем соединение
//   //     }
//   //   } catch (error) {
//   //     console.error("Ошибка при проверке интернет-соединения:", error);
//   //   }
//   // };

// });  




// console.log(process.env.DEVELOPMENT_ATLAS_URI)
// app.use(cors({
//   origin: 'http://127.0.0.1:5502', // replace with the actual origin of your frontend
//   credentials: true,
// }
// ))




const PORT = process.env.PORT_EXPRESS_SERVER || 5500
server.listen(PORT, () => {
  console.log(`server is working on server ${PORT}`);
});

