

export default async function MarkDelivered(socket, io, orderId, deliverySockets, adminSocket, users){
    console.log("Order Delivered:", orderId);

    let clientSocketId = null;
    for (const [clientId, clientData] of Object.entries(users)) {
        if (clientData.orderId === orderId) {
            clientSocketId = clientId;
            break;  // Stop once found
        }
    }
    
    // Notify client
    if (clientSocketId) {
        console.log(`Emitting order completion to client: ${clientSocketId}`);
     //   adminSocket.emit("order-completed", orderId)
        io.to(clientSocketId).emit("order-completed", clientSocketId);
    } else {
        console.log(`No client found for Order ID: ${orderId}`);
    }
}