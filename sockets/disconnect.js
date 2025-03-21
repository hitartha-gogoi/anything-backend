

export default async function Disconnect(socket, deliverySockets){
    if (deliverySockets[socket.id]) {
        delete deliverySockets[socket.id];
    }

    console.log(`User disconnected: ${socket.id}`)
}