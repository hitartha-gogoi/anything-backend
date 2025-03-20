import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const UserSchema = mongoose.Schema({
	deviceToken: { type: String, required: true, unique: true },
	userType: { type: String, required: true }
})


export default mongoose.models.User || mongoose.model('User', UserSchema)