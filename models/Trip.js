import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalKm: {
      type: Number,
      required: true,
    },
    ratePerKm: {
      type: Number,
      required: true,
    },
    toll: {
      type: Number,
      default: 0,
    },
    permit: {
      type: Number,
      default: 0,
    },
    borderTaxes: [
      {
        state: String,
        amount: Number,
      },
    ],
    totalAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;