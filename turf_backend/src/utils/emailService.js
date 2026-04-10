const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS environment variable is not set");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   // ✅ use host instead of service
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000,
  });

  return transporter;
};

/**
 * Sends a booking confirmation email to the user.
 * @param {Object} booking - The booking document
 * @param {string} [recipientEmail] - Override email address (defaults to booking.email)
 */
const sendBookingConfirmationEmail = async (booking, recipientEmail) => {
  const toEmail = recipientEmail || booking.email;
  if (!toEmail) return;

  const {
    customerName,
    email: bookingEmail,
    turfName,
    sport,
    bookingDate,
    toDate,
    fromTime,
    toTime,
    slots,
    guestCount,
    guestCharges,
    status,
  } = booking;

  // Format YYYY-MM-DD → DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  };

  // Format HH:mm → h:mm AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${period}`;
  };

  // Build time slot display: list each slot individually if multiple
  const slotList = Array.isArray(slots) && slots.length > 0 ? slots : [{ startTime: fromTime, endTime: toTime }];
  const formattedSlots = slotList
    .map(s => `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`)
    .join('<br/>');

  // Show "DD-MM-YYYY" if same day, else "DD-MM-YYYY – DD-MM-YYYY"
  const formattedDateRange =
    !toDate || toDate === bookingDate
      ? formatDate(bookingDate)
      : `${formatDate(bookingDate)} – ${formatDate(toDate)}`;

  const siteUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const guestSection =
    guestCount > 0
      ? `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Guests</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${guestCount} guest(s) &nbsp;|&nbsp; Guest Charges: ₹${guestCharges}</td>
        </tr>`
      : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background-color:#1a7a4a; padding: 28px 32px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">Uplift Sports Arena</h1>
                    <p style="color:#d4f5e2; margin:6px 0 0; font-size:14px;">Booking Confirmation</p>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding: 28px 32px 16px;">
                    <p style="font-size:16px; color:#333; margin:0;">Hi <strong>${customerName}</strong>,</p>
                    <p style="font-size:15px; color:#555; margin:10px 0 0;">Your turf has been booked successfully! Here are your booking details:</p>
                  </td>
                </tr>

                <!-- Booking Details Table -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius:6px; overflow:hidden; font-size:14px;">
                      <tr style="background-color:#f9f9f9;">
                        <td style="padding: 10px 12px; font-weight:700; color:#1a7a4a; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;" colspan="2">Booking Summary</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Turf</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${turfName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Sport</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${sport}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Date</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formattedDateRange}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555; vertical-align: top;">Time Slot</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formattedSlots}</td>
                      </tr>
                      ${guestSection}
                      <tr>
                        <td style="padding: 8px 12px; color: #555;">Status</td>
                        <td style="padding: 8px 12px; font-weight: 600; color: #1a7a4a; text-transform: capitalize;">${status}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Note -->
                <tr>
                  <td style="padding: 0 32px 28px;">
                    <p style="font-size:13px; color:#888; margin:0; line-height:1.6;">
                      Please arrive 10 minutes before your scheduled time. For any queries or cancellations, contact us at
                      <a href="mailto:upliftsportsarena@gmail.com" style="color:#1a7a4a;">upliftsportsarena@gmail.com</a>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f0f0f0; padding: 16px 32px; text-align:center;">
                    <p style="font-size:13px; color:#555; margin:0 0 6px;">
                      <a href="${siteUrl}" style="color:#1a7a4a; text-decoration:none; font-weight:600;">${siteUrl}</a>
                    </p>
                    <p style="font-size:12px; color:#aaa; margin:0;">© ${new Date().getFullYear()} Uplift Sports Arena. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await createTransporter().sendMail({
    from: `"Uplift Sports Arena" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Booking Confirmed – ${turfName} on ${formatDate(bookingDate)}`,
    html: htmlContent,
  });
};

/**
 * Sends a password reset email with reset link.
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @param {string} resetLink - Password reset link
 */
const sendPasswordResetEmail = async (email, name, resetLink) => {
  const siteUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background-color:#08295E; padding: 28px 32px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">Uplift Sports Arena</h1>
                    <p style="color:#A6CE39; margin:6px 0 0; font-size:14px;">Password Reset Request</p>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding: 28px 32px 16px;">
                    <p style="font-size:16px; color:#333; margin:0;">Hi <strong>${name}</strong>,</p>
                    <p style="font-size:15px; color:#555; margin:12px 0 0; line-height:1.7;">
                      We received a request to reset your password. Click the button below to set a new password.
                    </p>
                    <p style="font-size:13px; color:#999; margin:14px 0 0;">This link will expire in 1 hour.</p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 24px 32px; text-align:center;">
                    <a href="${resetLink}"
                      style="display:inline-block; background-color:#A6CE39; color:#08295E; text-decoration:none;
                             font-weight:700; font-size:15px; padding:14px 32px; border-radius:6px;
                             border: 2px solid #08295E; letter-spacing:0.3px;">
                      Reset Password
                    </a>
                  </td>
                </tr>

                <!-- Manual Link -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <p style="font-size:12px; color:#999; margin:0 0 8px;">If the button doesn't work, copy and paste this link in your browser:</p>
                    <p style="font-size:12px; color:#08295E; word-break: break-all; margin:0;">
                      <a href="${resetLink}" style="color:#08295E; text-decoration:none;">${resetLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Warning -->
                <tr>
                  <td style="padding: 16px 32px; background-color:#fff3cd; border-left: 4px solid #ffc107;">
                    <p style="font-size:12px; color:#856404; margin:0; line-height:1.6;">
                      <strong>Didn't request a password reset?</strong> Ignore this email if you didn't request this action.
                      Your password will remain unchanged.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f0f0f0; padding: 16px 32px; text-align:center;">
                    <p style="font-size:13px; color:#555; margin:0 0 6px;">
                      <a href="${siteUrl}" style="color:#08295E; text-decoration:none; font-weight:600;">${siteUrl}</a>
                    </p>
                    <p style="font-size:12px; color:#aaa; margin:0;">© ${new Date().getFullYear()} Uplift Sports Arena. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await createTransporter().sendMail({
    from: `"Uplift Sports Arena" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password – Uplift Sports Arena',
    html: htmlContent,
  });
};

/**
 * Sends a membership expiry reminder email on the day the plan expires.
 * @param {Object} membership - The membership document
 */
async function sendMembershipExpiryEmail(membership) {
  const { name, email, membershipType, endDate } = membership;
  if (!email) return;

  const siteUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const membershipPageUrl = `${siteUrl}/my-membership`;
  const upgradeUrl = `${siteUrl}/membership`;

  // Format endDate → DD-MM-YYYY
  const formatDate = (d) => {
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const formattedEnd = formatDate(endDate);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                  <td style="background-color:#08295E; padding: 28px 32px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">Uplift Sports Arena</h1>
                    <p style="color:#A6CE39; margin:6px 0 0; font-size:14px;">Membership Expiry Notice</p>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding: 28px 32px 16px;">
                    <p style="font-size:16px; color:#333; margin:0;">Hi <strong>${name}</strong>,</p>
                    <p style="font-size:15px; color:#555; margin:12px 0 0; line-height:1.7;">
                      Your <strong>${membershipType}</strong> membership at Uplift Sports Arena
                      <strong>expires today (${formattedEnd})</strong>.
                    </p>
                    <p style="font-size:15px; color:#555; margin:10px 0 0; line-height:1.7;">
                      Don't miss out on uninterrupted access to our courts and facilities.
                      Renew or upgrade your plan today to keep playing!
                    </p>
                  </td>
                </tr>

                <!-- Membership Summary -->
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius:6px; overflow:hidden; font-size:14px;">
                      <tr style="background-color:#f9f9f9;">
                        <td style="padding: 10px 12px; font-weight:700; color:#08295E; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;" colspan="2">Membership Details</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Member Name</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Plan</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${membershipType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 12px; color: #555;">Expiry Date</td>
                        <td style="padding: 8px 12px; font-weight: 600; color: #c0392b;">${formattedEnd}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 32px 32px; text-align:center;">
                    <a href="${upgradeUrl}"
                      style="display:inline-block; background-color:#A6CE39; color:#08295E; text-decoration:none;
                             font-weight:700; font-size:15px; padding:14px 32px; border-radius:6px;
                             border: 2px solid #08295E; letter-spacing:0.3px;">
                      Upgrade to Annual Plan
                    </a>
                    <p style="margin:12px 0 0; font-size:13px; color:#888;">
                      Or view your membership details at
                      <a href="${membershipPageUrl}" style="color:#08295E; font-weight:600;">My Membership</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f0f0f0; padding: 16px 32px; text-align:center;">
                    <p style="font-size:13px; color:#555; margin:0 0 6px;">
                      <a href="${siteUrl}" style="color:#08295E; text-decoration:none; font-weight:600;">${siteUrl}</a>
                    </p>
                    <p style="font-size:12px; color:#aaa; margin:0;">© ${new Date().getFullYear()} Uplift Sports Arena. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await createTransporter().sendMail({
    from: `"Uplift Sports Arena" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Membership Expires Today – Renew Now | Uplift Sports Arena`,
    html: htmlContent,
  });
}

module.exports = { sendBookingConfirmationEmail, sendMembershipExpiryEmail, sendPasswordResetEmail };
