import cron from "node-cron";

const SELF_URL = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;

const runKeepAlive = () => {
  if (!SELF_URL) {
    console.log("Keep-alive skipped: no RENDER_EXTERNAL_URL / SELF_URL set");
    return;
  }

  // Runs every 10 minutes, keeps the Render free-tier instance from spinning down
  cron.schedule("*/10 * * * *", async () => {
    try {
      const res = await fetch(`${SELF_URL}/api/health`);
      console.log(`Keep-alive ping: ${res.status}`);
    } catch (error) {
      console.error("Keep-alive ping failed:", error.message);
    }
  });
};

export default runKeepAlive;
