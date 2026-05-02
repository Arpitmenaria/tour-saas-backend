import { webcrypto } from "crypto";
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";
import runTaxReminder from "./cron/taxReminder.js";
import tripRoutes from "./routes/tripRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";




dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/taxes", taxRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/invoice", invoiceRoutes);


app.use("/api/dashboard", dashboardRoutes);


app.use("/api/analytics", analyticsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  runTaxReminder();
});