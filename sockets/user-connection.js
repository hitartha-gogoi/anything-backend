import Order from "../models/order.js";

export default async function UserConnection(socket, io, userType, userNumber, orderId, adminSocket, deliverySockets, users){

    if(userType == "ADMIN"){
        adminSocket = socket
        console.log(userType)
        socket.emit('user-joined', socket.id)
    } else if(userType == "DELIVERY"){
        deliverySockets[socket.id] = { socket, userNumber, userType, orderId }
        console.log(userType)
        socket.emit('user-joined', socket.id)
    } else if(userType == "CLIENT"){
        users[socket.id] = { socket, userNumber, userType, orderId }
        console.log(userType)
        const pendingOrders = await Order.find({ status: "PENDING" }).sort({ timestamp: -1 });
        if(adminSocket){
            console.log("admin socket id : ", adminSocket.id)
            io.to(adminSocket.id).emit("new-pending-order", pendingOrders)
        } else {
            console.log("NO ADMIN")
        }
        socket.emit('user-joined',socket.id)
    }
}