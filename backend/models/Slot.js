const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
    unique: true
  },
  timeSlots: {
    type: [String], // ✅ Flat array of strings: ['09:00', '10:00', ...]
    default: []
  }
});

module.exports = mongoose.model('Sloat', slotSchema);
