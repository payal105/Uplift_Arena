const City = require("../models/City");

// Get all cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.json({ cities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get city by ID
exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json({ city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create city (Admin only)
exports.createCity = async (req, res) => {
  try {
    const { name, state, country } = req.body;
    const city = await City.create({ name, state, country });
    res.status(201).json({ message: "City created successfully", city });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "City already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update city (Admin only)
exports.updateCity = async (req, res) => {
  try {
    const { name, state, country, isActive } = req.body;
    const city = await City.findByIdAndUpdate(
      req.params.id,
      { name, state, country, isActive },
      { new: true }
    );
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json({ message: "City updated successfully", city });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete city (Admin only)
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
