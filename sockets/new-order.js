import Order from "../models/order.js";

export default async function NewOrder(socket, order, adminSocket){
    
    console.log("New order received: ", order)

    // notify admin

    try {
          const pendingOrders = await Order.find({ status: "PENDING" }).sort({ timestamp: -1 });

          if(adminSocket){
              console.log(adminSocket, pendingOrders)
              adminSocket.emit("OrderPending", pendingOrders)
          }
          
    
        } catch (error) {
          console.log(error);
        }

    
}