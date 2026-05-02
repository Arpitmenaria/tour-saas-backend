import Vehicle from "../models/Vehicle.js";

// Add Vehicle
export const addVehicle = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { vehicleNumber, type, capacity } = req.body;

    const vehicle = new Vehicle({
      vehicleNumber,
      type,
      capacity,
    });

    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
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