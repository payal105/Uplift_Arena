const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS environment variable is not set");
  }
  return nodemailer.createTransport({
    service: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     connectionTimeout: 5000
  });
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

  // Show "DD-MM-YYYY" if same day, else "DD-MM-YYYY – DD-MM-YYYY"
  const formattedDateRange =
    !toDate || toDate === bookingDate
      ? formatDate(bookingDate)
      : `${formatDate(bookingDate)} – ${formatDate(toDate)}`;

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
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #555;">Time Slot</td>
                        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formatTime(fromTime)} – ${formatTime(toTime)}</td>
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

module.exports = { sendBookingConfirmationEmail };
