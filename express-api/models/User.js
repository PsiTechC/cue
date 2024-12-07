// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   otp: { type: String, required: false }, // Add OTP field
//   // Other fields...
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   otp: { type: String, required: false },
//   totalMinutes: { type: Number, default: 0 },
//   usedMinutes: { type: Number, default: 0 }
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: false },
  totalMinutes: { type: Number, default: 0 },
  usedMinutes: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false }  // New field for admin status
});

const User = mongoose.model('User', userSchema);
module.exports = User;
