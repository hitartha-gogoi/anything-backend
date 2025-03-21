import UserConnection from "./user-connection.js";
import Disconnect from "./disconnect.js";
import KinaHol from "./kina-hol.js";
import ApproveOrder from "./approve-order.js";
import FlagOrder from "./flag-order.js";
import MarkDelivered from "./delivery.js";

// Store connected users
const users = {}
const adminSocket = null;
const deliverySockets = {}

export default function Socket(socket,io){

    console.log("A user connected:", socket.id);

    socket.on('user-connected', (userType, userNumber, orderId)=> UserConnection(socket, io, userType, userNumber, orderId, adminSocket, deliverySockets, users))

    socket.on("kina-hol", (deliveryPerson, deliveryNumber, orderId)=> KinaHol(socket, io, deliveryPerson, deliveryNumber, orderId, deliverySockets, users))

    socket.on("flag-order", (orderId) => FlagOrder(socket, io, orderId, deliverySockets, users));

    socket.on("verify-otp", (deliveryPerson, deliveryNumber, orderId, otp)=> ApproveOrder(socket, io, deliveryPerson, deliveryNumber, orderId, otp, deliverySockets, users))

    socket.on("delivered-order", (orderId) => MarkDelivered(socket, io, orderId, deliverySockets, adminSocket, users));

    socket.on("disconnect", ()=> Disconnect(socket, deliverySockets))

}
