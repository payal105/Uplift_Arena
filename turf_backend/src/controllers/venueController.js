const Venue = require("../models/Venue");
const City = require("../models/City");
const Turf = require("../models/Turf");

// Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const { cityId } = req.query;
    const filter = { isActive: true };
    
    if (cityId) {
      filter.city = cityId;
    }

    const venues = await Venue.find(filter)
      .populate("city", "name")
      .sort({ name: 1 });
    
    res.json({ venues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get venues by city with turfs (Public)
exports.getVenuesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    
    if (!cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    // Verify city exists
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Get active venues in the city
    const venues = await Venue.find({ 
      city: cityId, 
      isActive: true 
    })
    .populate("city", "name state")
    .sort({ name: 1 });

    // Get turfs for each venue
    const venuesWithTurfs = await Promise.all(
      venues.map(async (venue) => {
        const turfs = await Turf.find({ 
          venue: venue._id, 
          isActive: true 
        }).select('name sportType pricePerHour images amenities');
        
        return {
          ...venue.toObject(),
          turfs
        };
      })
    );

    res.json({ 
      success: true,
      city: city.name,
      venues: venuesWithTurfs 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate("city", "name");
    
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    
    res.json({ venue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create venue (Admin only)
exports.createVenue = async (req, res) => {
  try {
    const { city, name, address } = req.body;

    // Verify city exists
    const cityExists = await City.findById(city);
    if (!cityExists) {
      return res.status(404).json({ message: "City not found" });
    }

    const venue = await Venue.create({ city, name, address });
    const populatedVenue = await Venue.findById(venue._id).populate("city", "name");
    
    res.status(201).json({ 
      message: "Venue created successfully", 
      venue: populatedVenue 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update venue (Admin only)
exports.updateVenue = async (req, res) => {
  try {
    const { city, name, address, isActive } = req.body;

    if (city) {
      const cityExists = await City.findById(city);
      if (!cityExists) {
        return res.status(404).json({ message: "City not found" });
      }
    }

    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { city, name, address, isActive },
      { new: true }
    ).populate("city", "name");

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json({ message: "Venue updated successfully", venue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete venue (Admin only)
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
