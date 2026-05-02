import express from "express";
import { payTax, getTaxes } from "../controllers/taxController.js";

const router = express.Router();

router.post("/pay", payTax);
router.get("/", getTaxes);

export default router;