const cron = require("node-cron");
const Membership = require("../models/Membership");
const { sendMembershipExpiryEmail } = require("../utils/emailService");

/**
 * Runs every day at 6:00 AM.
 * Finds all active memberships whose endDate falls on today's date
 * and sends each member a expiry reminder email.
 */
const startMembershipExpiryCron = () => {
  // Cron expression: "0 6 * * *" → at 06:00 every day
  cron.schedule("0 6 * * *", async () => {
    try {
      const now = new Date();
      // Start and end of today (UTC)
      const todayStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
      const todayEnd   = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59));

      const expiringToday = await Membership.find({
        isActive: 1,
        endDate: { $gte: todayStart, $lte: todayEnd },
      });

      if (expiringToday.length === 0) {
        console.log(`[MembershipCron] No memberships expiring today (${now.toDateString()}).`);
        return;
      }

      console.log(`[MembershipCron] Sending expiry emails to ${expiringToday.length} member(s)...`);

      for (const membership of expiringToday) {
        try {
          await sendMembershipExpiryEmail(membership);
          console.log(`[MembershipCron] Email sent to ${membership.email}`);
        } catch (emailErr) {
          console.error(`[MembershipCron] Failed to send email to ${membership.email}:`, emailErr.message);
        }
      }
    } catch (err) {
      console.error("[MembershipCron] Error running expiry check:", err.message);
    }
  }, {
    timezone: "Asia/Kolkata",
  });

  console.log("[MembershipCron] Membership expiry cron scheduled (daily at 6:00 AM IST).");
};

module.exports = { startMembershipExpiryCron };
