import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
  },
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;