import express from "express";
import {
  getSummary,
  getFilteredTrips,
  getVehicleWiseData,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/trips", getFilteredTrips);
router.get("/vehicle-wise", getVehicleWiseData);

export default router;