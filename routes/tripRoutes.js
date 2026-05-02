import express from "express";
import { addTrip, getTrips } from "../controllers/tripController.js";

const router = express.Router();

router.post("/", addTrip);
router.get("/", getTrips);

export default router;