const Membership = require("../models/Membership");
const UserData = require("../models/UserData");

// Determine validity duration in days based on plan
function getDurationDays(membershipType) {
  if (membershipType === "monthly-individual-activity") return 30;
  // All annual plans: 365 days
  return 365;
}

// POST /api/memberships — submit membership form (authenticated user)
exports.createMembership = async (req, res) => {
  try {
    const { name, email, phone, membershipType, activityChoice, message } = req.body;

    if (!name || !email || !phone || !membershipType) {
      return res.status(400).json({ message: "name, email, phone and membershipType are required" });
    }

    const activityRequiredPlans = ["annual-individual-activity", "monthly-individual-activity"];
    if (activityRequiredPlans.includes(membershipType) && !activityChoice) {
      return res.status(400).json({ message: "activityChoice is required for this membership type" });
    }

    // Compute start & end dates (start = today midnight UTC)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + getDurationDays(membershipType) - 1);
    endDate.setHours(23, 59, 59, 999);

    // Deactivate all previous memberships for this user
    await Membership.updateMany(
      { userId: req.userId, isActive: 1 },
      { $set: { isActive: 0 } }
    );

    // Create new active membership record
    const membership = await Membership.create({
      userId: req.userId,
      name,
      email,
      phone,
      membershipType,
      activityChoice: activityRequiredPlans.includes(membershipType) ? activityChoice : null,
      message: message || "",
      startDate,
      endDate,
      isActive: 1,
    });

    // Mark user as member
    await UserData.findByIdAndUpdate(req.userId, { isMember: 1 });

    res.status(201).json({
      message: "Membership submitted successfully",
      membership,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/memberships/my — get logged-in user's membership(s)
exports.getMyMembership = async (req, res) => {
  try {
    const memberships = await Membership.find({ userId: req.userId }).sort({ createdAt: -1 });

    // Auto-expire memberships dynamically
    const now = new Date();
    let updatedMembership = false;
    for (const m of memberships) {
      if (m.isActive === 1 && m.endDate < now) {
        m.isActive = 0;
        await m.save();
        updatedMembership = true;
      }
    }

    if (updatedMembership) {
      // Check if user still has any active membership
      const hasActive = memberships.some(m => m.isActive === 1);
      if (!hasActive) {
        await UserData.findByIdAndUpdate(req.userId, { isMember: 0 });
      }
    }

    res.json({ memberships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
