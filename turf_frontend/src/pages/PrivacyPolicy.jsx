import React from 'react';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Privacy Policy Banner" />
        </div>
        <div className="container content-area">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us</p>
        </div>
      </div>

      <section className="policy-section section-padding">
        <div className="container">
          <p className="text-muted mb-4">Last Updated: January 6, 2026</p>

          <section className="mb-4">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you register for an account,
              make a booking, or communicate with us. This may include:
            </p>
            <ul>
              <li>Name and contact information (email, phone number, address)</li>
              <li>Payment information</li>
              <li>Booking history and preferences</li>
              <li>Communication records</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process your bookings and payments</li>
              <li>Send you booking confirmations and updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information with:
            </p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for transaction processing</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-4">
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          <section className="mb-4">
            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience,
              analyze site traffic, and understand user preferences. You can control cookie settings
              through your browser.
            </p>
          </section>

          <section className="mb-4">
            <h2>7. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-4">
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-4">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@example.com</li>
              <li>Phone: +91-12682862355</li>
            </ul>
          </section>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
