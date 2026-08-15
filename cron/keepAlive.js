import cron from "node-cron";

const SELF_URL = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
const DEFAULT_SCHEDULE = "*/10 * * * *"; // every 10 minutes
const SCHEDULE = process.env.KEEP_ALIVE_CRON || DEFAULT_SCHEDULE;

const runKeepAlive = () => {
  if (!SELF_URL) {
    console.log("Keep-alive skipped: no RENDER_EXTERNAL_URL / SELF_URL set");
    return;
  }

  if (!cron.validate(SCHEDULE)) {
    console.error(`Keep-alive skipped: invalid KEEP_ALIVE_CRON "${SCHEDULE}"`);
    return;
  }

  cron.schedule(SCHEDULE, async () => {
    try {
      const res = await fetch(`${SELF_URL}/api/health`);
      console.log(`Keep-alive ping: ${res.status}`);
    } catch (error) {
      console.error("Keep-alive ping failed:", error.message);
    }
  });

  console.log(`Keep-alive cron scheduled: "${SCHEDULE}" -> ${SELF_URL}/api/health`);
};

export default runKeepAlive;
