const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  course: { type: [String], required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Employee', EmployeeSchema);