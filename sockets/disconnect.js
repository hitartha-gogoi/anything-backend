

export default async function Disconnect(socket, deliverySockets){
    deliverySockets.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`)
}