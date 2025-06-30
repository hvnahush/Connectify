const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  bio: { type: String, default: '' },
  profilePic: { type: String },
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
