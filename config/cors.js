const productionUrl = ""
const localHostUrl = "http://192.168.29.244:8080"
const socketAdminUrl = "https://admin.socket.io"
const socketUrl = "http://192.168.23.65:8080"

const corsOptions = {
    origin: [productionUrl, localHostUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };

  export const corsConfig = {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  }


export default corsOptions
  