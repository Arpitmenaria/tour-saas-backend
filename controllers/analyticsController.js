import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";

// 🔥 SUMMARY API
export const getSummary = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    const trips = await Trip.find(filter);

    let totalRevenue = 0;
    let totalToll = 0;
    let totalPermit = 0;
    let totalBorderTax = 0;

    trips.forEach((trip) => {
      totalRevenue += trip.totalAmount || 0;
      totalToll += trip.toll || 0;
      totalPermit += trip.permit || 0;

      const borderSum = trip.borderTaxes.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );

      totalBorderTax += borderSum;
    });

    res.json({
      totalTrips: trips.length,
      totalRevenue,
      totalToll,
      totalPermit,
      totalBorderTax,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 TRIP LIST API
export const getFilteredTrips = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (vehicleId) {
      filter.vehicleId = vehicleId;
    }

    const trips = await Trip.find(filter)
      .populate("vehicleId")
      .sort({ startDate: -1 });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleWiseData = async (req, res) => {
  try {
    const { filter } = req.query;

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (filter === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (filter === "3months") {
      startDate.setMonth(startDate.getMonth() - 3);
    }

    // ✅ STEP 1: GET ALL VEHICLES
    const vehicles = await Vehicle.find();

    // ✅ STEP 2: MAP EACH VEHICLE
    const result = await Promise.all(
      vehicles.map(async (vehicle) => {
        const trips = await Trip.find({
          vehicleId: vehicle._id,
          createdAt: { $gte: startDate },
        });

        const totalTrips = trips.length;

        const totalRevenue = trips.reduce(
          (sum, t) => sum + (t.totalAmount || 0),
          0
        );

        return {
          vehicleId: vehicle._id,
          vehicleNumber: vehicle.vehicleNumber,
          totalTrips,
          totalRevenue,
        };
      })
    );

    res.json(result);

  } catch (error) {
    console.error("Vehicle-wise error:", error);
    res.status(500).json({ message: "Server error" });
  }
};