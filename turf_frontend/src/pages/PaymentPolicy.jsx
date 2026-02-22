import React from 'react';

const PaymentPolicy = () => {
  return (
    <>
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Payment Policy Banner" />
        </div>
        <div className="container content-area">
          <h1>Payment Policy</h1>
          <p>Clear and transparent payment terms</p>
        </div>
      </div>

      <section className="policy-section section-padding">
        <div className="container">
          <p className="text-muted mb-4">Last Updated: January 6, 2026</p>

          <section className="mb-4">
            <h2>1. Payment Methods</h2>
            <p>We accept the following payment methods:</p>
            <ul>
              <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
              <li>Net Banking</li>
              <li>UPI (Unified Payments Interface)</li>
              <li>Digital Wallets (Paytm, PhonePe, Google Pay)</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>2. Booking Payment</h2>
            <p>
              All bookings require full payment at the time of reservation. Your booking will be
              confirmed only after successful payment processing.
            </p>
          </section>

          <section className="mb-4">
            <h2>3. Payment Security</h2>
            <p>
              All payment transactions are processed through secure payment gateways. We do not store
              your complete credit/debit card information on our servers. Your payment information is
              encrypted and transmitted securely.
            </p>
          </section>

          <section className="mb-4">
            <h2>4. Pricing</h2>
            <p>
              All prices displayed on our website are in Indian Rupees (INR) and are inclusive of
              applicable taxes. Prices may vary based on:
            </p>
            <ul>
              <li>Time of day</li>
              <li>Day of the week (weekday vs. weekend)</li>
              <li>Special events or peak hours</li>
              <li>Duration of booking</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>5. Cancellation and Refunds</h2>
            <p>Our cancellation and refund policy is as follows:</p>
            <ul>
              <li><strong>24+ hours before booking:</strong> Full refund minus processing fee (5%)</li>
              <li><strong>12-24 hours before booking:</strong> 50% refund</li>
              <li><strong>Less than 12 hours before booking:</strong> No refund</li>
            </ul>
            <p>
              Refunds will be processed within 7-10 business days to the original payment method.
            </p>
          </section>

          <section className="mb-4">
            <h2>6. Failed Transactions</h2>
            <p>
              If your payment fails, please check with your bank or payment provider. If the amount
              has been debited from your account but the booking was not confirmed, please contact
              us immediately with transaction details. The amount will be refunded within 7-10
              business days.
            </p>
          </section>

          <section className="mb-4">
            <h2>7. Promotional Codes and Discounts</h2>
            <p>
              Promotional codes and discounts are subject to terms and conditions. They cannot be
              combined with other offers unless explicitly stated. Discounts are applied at checkout.
            </p>
          </section>

          <section className="mb-4">
            <h2>8. Price Changes</h2>
            <p>
              We reserve the right to modify prices at any time. However, prices are locked once you
              complete your booking.
            </p>
          </section>

          <section className="mb-4">
            <h2>9. Disputed Charges</h2>
            <p>
              If you have any concerns about charges, please contact us before disputing with your
              bank. We will investigate and resolve the issue promptly.
            </p>
          </section>

          <section className="mb-4">
            <h2>10. Contact Us</h2>
            <p>
              For payment-related queries, please contact us at:
            </p>
            <ul>
              <li>Email: payments@example.com</li>
              <li>Phone: +91-12682862355</li>
            </ul>
          </section>
        </div>
      </section>
    </>
  );
};

export default PaymentPolicy;
