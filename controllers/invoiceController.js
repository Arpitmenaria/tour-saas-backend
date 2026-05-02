import Trip from "../models/Trip.js";
import generateInvoice from "../utils/generateInvoice.js";

export const getInvoice = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("vehicleId");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (!trip.vehicleId) {
      return res.status(404).json({ message: "Vehicle not found for this trip" });
    }

    generateInvoice(trip, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};