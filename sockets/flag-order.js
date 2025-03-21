

export default async function FlagOrder(socket, io, orderId, deliverySockets, users){
   
    let clientSocketId = null;
    for (const [clientId, clientData] of Object.entries(users)) {
        if (clientData.orderId === orderId) {
            clientSocketId = clientId;
            break;  // Stop once found
        }
    }

    if (clientSocketId) {
        console.log(`Emitting flagged-order to client: ${clientSocketId}`);
        io.to(clientSocketId).emit("flagged-order", clientSocketId);
    } else {
        console.log(`No client found for Order ID: ${orderId}`);
    }
    
}