const Slot = require("../models/Slot");
const Turf = require("../models/Turf");

// Get available slots for a turf on a specific date
exports.getSlotsByDate = async (req, res) => {
  try {
    const { turfId, date } = req.query;

    if (!turfId || !date) {
      return res.status(400).json({ 
        message: "turfId and date are required" 
      });
    }

    const slots = await Slot.find({ 
      turf: turfId, 
      date 
    })
    .populate("turf", "name pricePerHour slotDurationMinutes")
    .sort({ startTime: 1 });

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate slots for a turf (Admin only)
exports.generateSlots = async (req, res) => {
  try {
    const { turfId, date, startTime, endTime } = req.body;

    console.log("Generate Slots Request:", { turfId, date, startTime, endTime });

    if (!turfId || !date || !startTime || !endTime) {
      return res.status(400).json({ 
        message: "All fields are required: turfId, date, startTime, endTime" 
      });
    }

    // Verify turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    console.log("Turf found:", { name: turf.name });

    // Create a single slot
    const slot = await Slot.create({
      turf: turfId,
      date,
      startTime,
      endTime,
      status: "AVAILABLE"
    });

    console.log("Created slot:", slot);
    
    res.status(201).json({ 
      message: "Slot created successfully", 
      slot
    });
  } catch (error) {
    console.error("Slot creation error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slot already exists for this time" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update slot status (Admin only)
exports.updateSlotStatus = async (req, res) => {
  try {
    const { status, blockedBy } = req.body;

    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { status, blockedBy },
      { new: true }
    ).populate("turf", "name");

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot updated successfully", slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete slot (Admin only)
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available slots by venue (Public)
exports.getSlotsByVenue = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.status(400).json({ 
        message: "venueId and date are required" 
      });
    }

    // Get all turfs in the venue
    const turfs = await Turf.find({ 
      venue: venueId, 
      isActive: true 
    }).select('_id name sportType');

    if (turfs.length === 0) {
      return res.json({ 
        success: true,
        slots: [],
        message: "No turfs found for this venue"
      });
    }

    const turfIds = turfs.map(t => t._id);

    // Get available slots for all turfs
    const slots = await Slot.find({
      turf: { $in: turfIds },
      date,
      status: "AVAILABLE"
    })
    .populate("turf", "name sportType pricePerHour")
    .sort({ startTime: 1 });

    res.json({ 
      success: true,
      turfs,
      slots 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk generate slots (Admin only)
exports.bulkGenerateSlots = async (req, res) => {
  try {
    const { turfId, dates, timeSlots } = req.body;

    if (!turfId || !dates || !timeSlots || dates.length === 0 || timeSlots.length === 0) {
      return res.status(400).json({ 
        message: "turfId, dates array, and timeSlots array are required" 
      });
    }

    // Verify turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    const slotsToCreate = [];
    const errors = [];

    // Generate slots for each date and time slot combination
    for (const date of dates) {
      for (const timeSlot of timeSlots) {
        try {
          // Check if slot already exists
          const existingSlot = await Slot.findOne({
            turf: turfId,
            date,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime
          });

          if (!existingSlot) {
            slotsToCreate.push({
              turf: turfId,
              date,
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
              status: "AVAILABLE"
            });
          }
        } catch (error) {
          errors.push({ date, timeSlot, error: error.message });
        }
      }
    }

    // Bulk insert slots
    const createdSlots = slotsToCreate.length > 0 
      ? await Slot.insertMany(slotsToCreate) 
      : [];

    res.status(201).json({ 
      success: true,
      message: `${createdSlots.length} slots created successfully`,
      createdCount: createdSlots.length,
      skippedCount: (dates.length * timeSlots.length) - createdSlots.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Bulk slot creation error:", error);
    res.status(500).json({ message: error.message });
  }
};
