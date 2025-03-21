import express from "express"
import morgan from "morgan"
import cors from "cors"
import 'dotenv/config'
import path from "path"
import { fileURLToPath } from "url";
import corsOptions, { corsConfig } from "./config/cors.js"
import orderRoutes from "./routes/orders.js"
import { Server } from 'socket.io';
import connectDB from "./config/connect-db.js"
import Socket from "./sockets/socket.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

//static files
app.use(express.static('./views'))
app.use(express.static(path.join(__dirname, 'views')));
app.get("/view", (req,res)=> res.sendFile(path.join(__dirname, "views", "email.html")))

// connect database
connectDB()

//socket server
export const socketServer = (server)=>{
  const io = new Server(server, { cors: corsConfig });
  console.log("The socket is running ")
  io.on("connection", (socket)=> Socket(socket, io));
  app.set("io", io);
  return io;
}

//centralized error handler
app.use((req, res, next) => {
  req.io = app.get("io"); // Attach io to req object
  next()
 });


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions))
app.use(morgan('dev'))

// Routes
app.use(orderRoutes)


export default app