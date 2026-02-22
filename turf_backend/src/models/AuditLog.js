const mongoose = require("mongoose")

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser"
  },

  action: String,

  entity: String,

  entityId: mongoose.Schema.Types.ObjectId

}, { timestamps: true })

module.exports = mongoose.model("AuditLog", auditLogSchema)
