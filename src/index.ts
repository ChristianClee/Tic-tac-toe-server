"use strict"
import { config } from 'dotenv'
config();
import cookieParser from "cookie-parser";
import http from 'http'
import { WebSocketServer } from "ws";
import  express from "express";
import cors from "cors";
import { router } from "./routes/ticTacRoutes.js";
import { WebSocketHeandler } from "./websoket/handleWebsocket.js";





const app = express() 
const server = http.createServer(app);
const webSocketHeandler = new WebSocketHeandler(server)

// app.use(cookieParser())

app.use(cors())
app.use(express.json())

app.use("", router);   
app.get('/', (req, res) => {
})


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

