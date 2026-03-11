import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/contact', form);
      toast.success(res.data.message);
      setForm(initialForm);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit message. Please try again later.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
                <p>Uplift sports arena, Paribahan Nagar, Siliguri, Gaurcharan, West Bengal, 734010</p>
              </div>

              <div className="contact-info-box mb-4">
                <h5>Phone</h5>
                <p>
                  <a href="tel:+919046899554">+91-9046899554</a>
                </p>
              </div>

              <div className="contact-info-box mb-4">
                <h5>Email</h5>
                <p>
                  <a href="mailto:contact@upliftsportsarena.com">contact@upliftsportsarena.com</a>
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="mb-4">Send Us A Message</h2>

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-secondary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <h2 className="mb-4">Find Us Here</h2>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.595202386509!2d88.38412097488852!3d26.725376068117118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4470316152883%3A0x6106a5c3049c9761!2sUplift%20sports%20arena!5e0!3m2!1sen!2sin!4v1773253338146!5m2!1sen!2sin"
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
