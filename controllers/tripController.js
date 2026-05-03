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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;

    const skip = (page - 1) * limit;

    const total = await Trip.countDocuments();

    const trips = await Trip.find()
      .populate("vehicleId")
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: trips,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};