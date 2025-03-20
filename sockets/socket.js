import UserConnection from "./user-connection.js";
import Disconnect from "./disconnect.js";
import NewOrder from "./new-order.js";
import ApproveOrder from "./approve-order.js";
import MarkDelivered from "./delivery.js";

// Store connected users
const users = {}
const adminSocket = null;
const deliverySockets = new Map()

export default function Socket(socket,io){

    console.log("A user connected:", socket.id);

    socket.on('user-connected', (userType)=> UserConnection(socket, userType, adminSocket, deliverySockets, users))

    socket.on("new-order", (order)=> NewOrder(socket, order, adminSocket))

    socket.on("verify-otp", (orderId)=> ApproveOrder(socket, io, deliveryPerson, deliveryNumber, otp, deliverySockets))

    socket.on("orderDelivered", (orderId) => MarkDelivered(socket, io, orderId));

    socket.on("disconnect", ()=> Disconnect(socket, deliverySockets))

}
