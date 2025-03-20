

export default async function UserConnection(socket, userType, adminSocket, deliverySockets, users){

    if(userType == "ADMIN"){
        adminSocket = socket
        console.log(userType, users)
        socket.broadcast.emit('user-joined', { message: socket.id })
    } else if(userType == "DELIVERY"){
        deliverySockets.set(socket.id, socket)
        console.log(userType, users)
        socket.broadcast.emit('user-joined', { message: socket.id })
    } else if(userType == "CLIENT"){
        users[socket.id] = socket
        console.log(userType, users)
        socket.broadcast.emit('user-joined', { message: socket.id })
    }
}