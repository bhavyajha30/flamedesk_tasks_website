import cron from "node-cron";
import { checkAndFailChallenges } from "../controllers/challengeContrller.js";

checkAndFailChallenges();

// Schedule daily check at 1:00 AM
cron.schedule("0 1 * * *", async () => {
  console.log("🕐 Running scheduled challenge check...");
  await checkAndFailChallenges();
});