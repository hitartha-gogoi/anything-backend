

export default async function ApproveOrder(socket, io, deliveryPerson, deliveryNumber, otp, deliverySockets){
    console.log("Approved: ", otp)
    io.emit("display-otp", otp)
}