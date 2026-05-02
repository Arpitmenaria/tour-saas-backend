import Vehicle from "../models/Vehicle.js";
import Tax from "../models/Tax.js";
import Trip from "../models/Trip.js";

export const getDashboard = async (req, res) => {
  try {
    // 📅 Current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 🚐 Total Vehicles
    const totalVehicles = await Vehicle.countDocuments();

    // 💰 Taxes paid this month
    const taxesPaid = await Tax.countDocuments({
      lastPaidDate: { $gte: startOfMonth, $lte: endOfMonth },
      status: "paid",
    });

    // 🚗 Trips this month
    const trips = await Trip.find({
      startDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // 💵 Total revenue
    const totalRevenue = trips.reduce(
      (sum, trip) => sum + trip.totalAmount,
      0
    );

    res.json({
      totalVehicles,
      taxesPaidThisMonth: taxesPaid,
      totalTripsThisMonth: trips.length,
      totalRevenueThisMonth: totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};