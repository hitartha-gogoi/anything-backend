

export default async function MarkDelivered(socket, io, orderId){
    console.log("Order Delivered:", orderId);
    
    // Notify client
    io.emit("orderDelivered", orderId);
}