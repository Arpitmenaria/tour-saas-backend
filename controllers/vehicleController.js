import Vehicle from "../models/Vehicle.js";

// Add Vehicle
export const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, type, capacity } = req.body;

    // validation
    if (!vehicleNumber || !type || !capacity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 🔥 CHECK DUPLICATE FIRST
    const existing = await Vehicle.findOne({ vehicleNumber });

    if (existing) {
      return res.status(400).json({
        message: "Vehicle already exists",
      });
    }

    const vehicle = new Vehicle({
      vehicleNumber,
      type,
      capacity,
    });

    await vehicle.save();

    res.status(201).json(vehicle);

  } catch (error) {
    console.error("Add Vehicle Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};