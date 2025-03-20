import http from "http"
import app from "./app.js"
import { socketServer } from "./app.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
})

socketServer(server)
