import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const OrderSchema = mongoose.Schema({
	list: { type: String, required: true },
	name: { type: String, required: true },
	address: { type: String, required: true },
	phoneNumber: { type: Number, required: true },
	status: {
		type: String,
		enum: ["PENDING", "APPROVED", "FLAGGED", "ASSIGNED", "DELIVERED"],
		default: "PENDING",
	  },
	otp: { type: Number, unique: true },
	deliveryPerson: { type: String },
    deliveryPersonNumber: { type: Number, required: true, default: 0, set: v => v ?? 0  },
	timestamp: { type: String, required: true, default: "", set: v => v || "" }
})


export default mongoose.models.Order || mongoose.model('Order', OrderSchema)

