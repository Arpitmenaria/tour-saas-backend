import Trip from "../models/Trip.js";

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
    const { startDate, endDate } = req.query;

    const match = {};

    if (startDate && endDate) {
      match.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const data = await Trip.aggregate([
      { $match: match },

      {
        $group: {
          _id: "$vehicleId",
          totalRevenue: { $sum: "$totalAmount" },
          totalToll: { $sum: "$toll" },
          totalPermit: { $sum: "$permit" },
          trips: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "_id",
          as: "vehicle",
        },
      },

      { $unwind: "$vehicle" },

      {
        $project: {
          vehicleNumber: "$vehicle.vehicleNumber",
          totalRevenue: 1,
          totalToll: 1,
          totalPermit: 1,
          trips: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};