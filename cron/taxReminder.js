import cron from "node-cron";
import Tax from "../models/Tax.js";

const runTaxReminder = () => {
  // Runs every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("🔔 Running Tax Reminder Job...");

    const today = new Date();
    const day = today.getDate();

    // Only act on 1st of month
    if (day !== 1) return;

    try {
      const dueTaxes = await Tax.find({
        nextDueDate: { $lte: today },
      }).populate("vehicleId");

      if (dueTaxes.length === 0) {
        console.log("✅ No pending taxes today");
        return;
      }

      dueTaxes.forEach((tax) => {
        console.log(
          `⚠️ TAX DUE: Vehicle ${tax.vehicleId.vehicleNumber}`
        );
      });

    } catch (error) {
      console.error("Cron Error:", error.message);
    }
  });
};

export default runTaxReminder;