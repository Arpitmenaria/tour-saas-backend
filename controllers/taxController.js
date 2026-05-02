import Tax from "../models/Tax.js";

// Create / Mark Tax Paid
export const payTax = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    const lastPaidDate = new Date();
    const nextDueDate = new Date(
      lastPaidDate.getFullYear(),
      lastPaidDate.getMonth() + 1,
      1
    );

    const tax = new Tax({
      vehicleId,
      lastPaidDate,
      nextDueDate,
      status: "paid",
    });

    await tax.save();

    res.status(201).json(tax);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all taxes (for dashboard)
export const getTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().populate("vehicleId");
    res.json(taxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};