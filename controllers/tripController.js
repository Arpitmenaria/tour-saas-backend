import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";


// Add Trip
export const addTrip = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      totalKm,
      ratePerKm,
      toll,
      permit,
      borderTaxes = [],
    } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);

if (!vehicle) {
  return res.status(400).json({ message: "Invalid vehicle ID" });
}

    const totalBorderTax = borderTaxes.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    const totalAmount =
      totalKm * ratePerKm +
      (toll || 0) +
      (permit || 0) +
      totalBorderTax;

    const trip = new Trip({
      vehicleId,
      startDate,
      endDate,
      totalKm,
      ratePerKm,
      toll,
      permit,
      borderTaxes,
      totalAmount,
    });

    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Trips
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicleId")
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};