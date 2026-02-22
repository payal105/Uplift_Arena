const Turf = require("../models/Turf");
const Venue = require("../models/Venue");

// Get all turfs
exports.getAllTurfs = async (req, res) => {
  try {
    const { venueId, sportType, city, search } = req.query;
    const filter = { isActive: true };
    
    if (venueId) {
      filter.venue = venueId;
    }
    
    if (sportType) {
      filter.sportType = sportType;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let turfs = await Turf.find(filter)
      .populate({
        path: "venue",
        populate: { path: "city", select: "name" }
      })
      .sort({ name: 1 });
    
    // Filter by city if provided
    if (city) {
      turfs = turfs.filter(turf => turf.venue?.city?._id?.toString() === city);
    }
    
    res.json({ turfs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get turf by ID
exports.getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id)
      .populate({
        path: "venue",
        populate: { path: "city", select: "name" }
      });
    
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    
    res.json({ turf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create turf (Admin only)
exports.createTurf = async (req, res) => {
  try {
    const { 
      venue, 
      name, 
      sportType, 
      pricePerHour, 
      slotDurationMinutes,
      bufferMinutes,
      amenities
    } = req.body;

    // Verify venue exists
    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Handle uploaded images
    const images = req.files ? req.files.map(file => `/uploads/turfs/${file.filename}`) : [];

    // Parse amenities if it's a string
    const parsedAmenities = typeof amenities === 'string' ? amenities.split(',').map(a => a.trim()).filter(a => a) : amenities;

    const turf = await Turf.create({
      venue,
      name,
      sportType,
      pricePerHour,
      slotDurationMinutes,
      bufferMinutes,
      amenities: parsedAmenities,
      images
    });

    const populatedTurf = await Turf.findById(turf._id)
      .populate({
        path: "venue",
        populate: { path: "city", select: "name" }
      });
    
    res.status(201).json({ 
      message: "Turf created successfully", 
      turf: populatedTurf 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update turf (Admin only)
exports.updateTurf = async (req, res) => {
  try {
    const { 
      venue, 
      name, 
      sportType, 
      pricePerHour,
      slotDurationMinutes,
      bufferMinutes, 
      amenities,
      existingImages, 
      isActive 
    } = req.body;

    if (venue) {
      const venueExists = await Venue.findById(venue);
      if (!venueExists) {
        return res.status(404).json({ message: "Venue not found" });
      }
    }

    // Handle new uploaded images
    const newImages = req.files ? req.files.map(file => `/uploads/turfs/${file.filename}`) : [];
    
    // Combine existing images with new images
    const parsedExistingImages = existingImages ? (typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages) : [];
    const allImages = [...parsedExistingImages, ...newImages];

    // Parse amenities if it's a string
    const parsedAmenities = typeof amenities === 'string' ? amenities.split(',').map(a => a.trim()).filter(a => a) : amenities;

    const turf = await Turf.findByIdAndUpdate(
      req.params.id,
      { 
        venue, 
        name, 
        sportType, 
        pricePerHour,
        slotDurationMinutes,
        bufferMinutes, 
        amenities: parsedAmenities, 
        images: allImages, 
        isActive 
      },
      { new: true }
    ).populate({
      path: "venue",
      populate: { path: "city", select: "name" }
    });

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.json({ message: "Turf updated successfully", turf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete turf (Admin only)
exports.deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findByIdAndDelete(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    res.json({ message: "Turf deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get turfs by sport type (Public)
exports.getTurfsBySportType = async (req, res) => {
  try {
    const { sportType } = req.params;
    const { cityId } = req.query;

    const filter = { 
      sportType, 
      isActive: true 
    };

    let turfs = await Turf.find(filter)
      .populate({
        path: "venue",
        populate: { path: "city", select: "name" }
      })
      .sort({ name: 1 });

    // Filter by city if provided
    if (cityId) {
      turfs = turfs.filter(turf => turf.venue?.city?._id?.toString() === cityId);
    }

    res.json({ 
      success: true,
      sportType,
      count: turfs.length,
      turfs 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get turf details with available slots (Public)
exports.getTurfWithSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const turf = await Turf.findById(id)
      .populate({
        path: "venue",
        populate: { path: "city", select: "name state" }
      });

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    // Get available slots for the date if provided
    let availableSlots = [];
    if (date) {
      const Slot = require("../models/Slot");
      availableSlots = await Slot.find({
        turf: id,
        date,
        status: "AVAILABLE"
      }).sort({ startTime: 1 });
    }

    res.json({ 
      success: true,
      turf,
      availableSlots 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
