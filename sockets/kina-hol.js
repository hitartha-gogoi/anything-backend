

export default async function KinaHol(socket, io, deliveryPerson, deliveryNumber, orderId, deliverySockets, users){

    let clientSocketId = null;
    console.log("THE DELIVERY PERSON TAPPED KINA HOL")
    for (const [clientId, clientData] of Object.entries(users)) {

        console.log("The order id: ", clientData.orderId, " The order Id we need: ", orderId)
        if (clientData.orderId === orderId) {        
            clientSocketId = clientId;
            break;  // Stop once found
        }
    }

    if (clientSocketId) {
        console.log(`Emitting OTP to client: ${clientSocketId}`);
        io.to(clientSocketId).emit("display-number", deliveryPerson, deliveryNumber, orderId, clientSocketId);
    } else {
        console.log(`No client found for Order ID: ${orderId}`);
    }

}