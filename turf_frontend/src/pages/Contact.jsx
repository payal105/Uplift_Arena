import React from 'react';

const Contact = () => {
  return (
    <>
      <div className="inner-banner-section">
        <div className="image-area">
          <img src="/assets/images/bdcm1.jpg" alt="Contact Us Banner" />
        </div>
        <div className="container content-area">
          <h1>Contact Us</h1>
          <p>Get in touch with us</p>
        </div>
      </div>

      <section className="contact-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <h2 className="mb-4">Get In Touch</h2>
              <p className="mb-4">
                Have questions or need assistance? Feel free to reach out to us. Our team is here to help you.
              </p>

              <div className="contact-info-box mb-4">
                <h5>Address</h5>
                <p>123 Sports Complex, Main Road, City Name, State - 123456</p>
              </div>

              <div className="contact-info-box mb-4">
                <h5>Phone</h5>
                <p>
                  <a href="tel:+911268286235">+91-12682862355</a>
                </p>
              </div>

              <div className="contact-info-box mb-4">
                <h5>Email</h5>
                <p>
                  <a href="mailto:example@gmail.com">example@gmail.com</a>
                </p>
              </div>

              <div className="contact-info-box mb-4">
                <h5>Business Hours</h5>
                <p>
                  Monday - Friday: 6:00 AM - 10:00 PM<br />
                  Saturday - Sunday: 6:00 AM - 11:00 PM
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="mb-4">Send Us A Message</h2>
              <form className="contact-form">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input type="text" className="form-control" id="name" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" id="phone" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input type="text" className="form-control" id="subject" required />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows="5" required></textarea>
                </div>

                <button type="submit" className="btn btn-secondary">Send Message</button>
              </form>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <h2 className="mb-4">Find Us Here</h2>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
