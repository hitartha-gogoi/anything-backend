import express from "express"
import User from "../models/user.js"
import Order from "../models/order.js"
import crypto from 'crypto';

const expoUrl = 'https://exp.host/--/api/v2/push/send';

const generateOtp = () => {
    return crypto.randomInt(1000, 9999).toString(); // 6-digit OTP
  };

const router = express.Router()

router.get("/orders", async(req,res)=>{

    try{
        const orders = await Order.find().sort({ timestamp: -1 })
        console.log(orders)
        return res.status(200).json({ message: "success", orders: orders })

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.get("/order/single/:id", async(req,res)=>{

    try{
        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ message: "NO ORDER FOUND" });
        return res.status(200).json({ message: "success", order: order  })

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.get("/order/approved", async (req, res) => {
    console.log("Order approved route")

    try {
      //console.log(Array.from(req.io.sockets.sockets.keys()))
      const latestPendingOrder = await Order.findOne({ status: "APPROVED" }).sort({ createdAt: -1 }).limit(1); // Only return the latest one
      if (!latestPendingOrder) return res.status(404).json({ message: "NO ORDERS" });
      return res.status(200).json({ message: "success", order: latestPendingOrder });

    } catch (error) {
      console.error("Error fetching pending order:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

router.get("/orders/pending", async (req, res) => {

    try {
        
      const pendingOrders = await Order.find({ status: "PENDING" }).sort({ timestamp: -1 });
      if(!pendingOrders) return res.status(404).json({ message: "NO ORDERS"})
      return res.status(200).json({ message: "success", orders: pendingOrders });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  });


router.post("/add-push-token", async(req,res)=>{

    try{

    const { pushToken, userType } = req.body

        if(!pushToken){
            return res.status(403).json({ message: "NOT FOUND" })
        }

        const user = new User({
            deviceToken: pushToken,
            userType: userType
        })

        await user.save()

        return res.status(200).json({ message: "success", pushId: user._id })

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.delete("/delete-push-token", async(req,res)=>{

    try{
        await User.findOneAndDelete({ deviceToken: req.body.deviceToken })
        return res.status(200).json({ message: "success" })

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.post("/order", async(req,res)=>{

    try{

        const { list, name, phoneNumber, address } = req.body

        if(!list && !name && !phoneNumber && !address){
            return res.status(404).json({ message: "please enter all details" })
        }

        const order = new Order({ 
            list: list,
            name: name,
            phoneNumber: phoneNumber,
            address: address,
            otp: generateOtp(),
            status: "PENDING",
            timestamp: new Date().toISOString(),
        })

        await order.save()

        const messages = []

        const admin = await User.findOne({ userType: "ADMIN"})

        if(!admin){
            req.io.emit("new-order", order)
            return res.status(200).json({ message: "success" })
        } else {
            req.io.emit("new-order", order)

            const messageObj = {
                to: admin.deviceToken,
                sound: 'default',
                title: `NEW ORDER`,
                body: `You have received an order by ${name}`,
                data: { extraData: `Phone: ${phoneNumber}; address: ${address}; order status: ${order.status}` },
                "data": {
                  "route": "Home"  // Specify the target route
                }
            }
    
            messages.push(messageObj)
          
            const response = await fetch(expoUrl, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(messages),
              });
          
              const responseData = await response.json();
              if (response.ok) {
                console.log("Notifications sent successfully:", responseData);
              } else {
                console.error("Failed to send notifications:", responseData);
              }

            return res.status(200).json({ message: "success", orderId: order._id, otp: order.otp })
        }

    } catch(error) {

        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
    
})

router.put("/order/approve/:id", async(req,res)=>{

    try{
        const orders = await Order.find().sort({ timestamp: -1 })
        const order = await Order.findByIdAndUpdate(req.params.id, { status: "APPROVED" }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "success", orders: orders })

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.put("/order/flag/:id", async(req,res)=>{

    try{
        const orders = await Order.find().sort({ timestamp: -1 })
        const order = await Order.findByIdAndUpdate(req.params.id, { $set: { status: "FLAGGED" } }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "success", orders: orders })

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.put("/order/assign/:id", async(req,res)=>{

    try{
        const { deliveryPerson, deliveryNumber } = req.body
        const order = await Order.findByIdAndUpdate(req.params.id, { $set: { status: "ASSIGNED", deliveryPerson, deliveryNumber: Number(deliveryNumber) } }, { new: true })

        if (!order) return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({ message: "success" })

    } catch(error) {

        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

router.put("/order/verify-otp/:id", async(req,res)=>{

    try{

        const { otp } = req.body
        const order = await Order.findById(req.params.id)

        if (!order) return res.status(404).json({ message: "NO ORDER FOUND" });

        if(Number(otp) === order.otp){
            await Order.findByIdAndUpdate(req.params.id, { status: "DELIVERED" }, { new: true });
           // req.io.emit("delivered-order", order.deliveryPerson, order.deliveryNumber, order.otp)
            return res.status(200).json({ message: "success" })
            
        } else {
            return res.status(200).json({ message: "INCORRECT OTP" })
        }
 

    } catch(error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }

})

const orderRoutes = router

export default orderRoutes