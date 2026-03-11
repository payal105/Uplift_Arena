const Contact = require("../models/Contact");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject, and message are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    await Contact.create({ name, email, phone: phone || "", subject, message });

    res.status(201).json({ message: "Your message has been submitted successfully!" });
  } catch (err) {
    console.error("Contact form error:", err.message);
    res.status(500).json({ message: "Failed to submit message. Please try again later." });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get contacts error:", err.message);
    res.status(500).json({ message: "Failed to fetch contact submissions." });
  }
};
