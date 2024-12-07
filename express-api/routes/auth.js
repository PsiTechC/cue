// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const User = require('../models/User'); 
// const SavedTable = require('../models/SavedTable');
// const authenticateToken = require('../middleware/auth');
// const mongoose = require('mongoose');
// const router = express.Router();

// // Secret for JWT
// const JWT_SECRET = 'your_jwt_secret';

// // Nodemailer transporter configuration
// const transporter = nodemailer.createTransport({
//   host: 'mail.samparkai.com',
//   port: 587,
//   secure: false, // TLS
//   auth: {
//     user: 'connect@samparkai.com',
//     pass: 'sakshi',
//   },
//   tls: {
//     rejectUnauthorized: false, 
//   },
// });


// // Helper function to generate OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// };

// // Helper function to send OTP via email
// const sendOTP = async (email, otp) => {
//   try {
//     await transporter.sendMail({
//       from: '"SamparkAI" <connect@samparkai.com>',
//       to: email,
//       subject: 'Your OTP for SamparkAI Signup',
//       text: `Your OTP for verification is: ${otp}`,
//       html: `<b>Your OTP for verification is: ${otp}</b>`,
//     });
//     console.log(`OTP sent to ${email}, otp: "${otp}"`); // Log OTP sent
//   } catch (error) {
//     console.error(`Error sending OTP to ${email}:`, error);
//   }
// };

// // Signup Route with OTP generation and verification
// router.post('/signup', async (req, res) => {
//   console.log('Signup route called'); // Debug statement

//   const { email, password, otp } = req.body; // Include OTP in the request body

//   if (!email || !password) {
//     console.log('Email and password are required for signup');
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   // Check if the user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     console.log(`Signup attempt: User already exists with email ${email}`);
//     return res.status(400).json({ message: 'User already exists' });
//   }

//   // Hash the password before saving
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Generate OTP and send it to user's email
//   const generatedOTP = generateOTP();
//   await sendOTP(email, generatedOTP);

//   // Create a new user with OTP
//   const newUser = new User({ email, password: hashedPassword, otp: generatedOTP });
//   await newUser.save();

//   console.log(`New user created with email: ${newUser.email}`);

//   // If OTP is provided, verify it
//   if (otp) {
//     console.log(`OTP verification attempt for user: ${email}, user otp: "${otp}"`);
//     if (newUser.otp === otp) {
//       console.log(`OTP verification successful for user: ${email}`);
//       newUser.otp = undefined; // Clear OTP after successful verification
//       await newUser.save(); // Save changes
//       const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
//       return res.json({ success: true, token });
//     } else {
//       console.log(`Invalid OTP attempt for user: ${email}`);
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//   }

//   res.json({ success: true, message: 'OTP sent to email. Please verify your OTP.' });
// });


// // Verify OTP and generate token
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   console.log(`OTP verification attempt for user: ${email}`);

//   // Check if the user exists
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log(`OTP verification failed: User not found for email ${email}`);
//     return res.status(400).json({ message: 'User not found' });
//   }

//   // Check if the OTP is correct
//   if (user.otp === otp) {
//     console.log(`OTP verification successful for user: ${email}`);
//     // Clear OTP after successful verification
//     user.otp = undefined; // Optional: clear the OTP after verification
//     await user.save(); // Save changes
//     // Generate JWT token after successful OTP verification, including user ID and email
//     const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
//     return res.json({ success: true, token });
//   } else {
//     console.log(`Invalid OTP attempt for user: ${email}`);
//     return res.status(400).json({ message: 'Invalid OTP' });
//   }
// });




// // Login Route
// router.post('/login', async (req, res) => {
//   console.log('Login route called');

//   const { email, password } = req.body;

//   // Check if the user exists
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log(`Login failed: User not found for email ${email}`);
//     return res.status(400).json({ message: 'User does not exist' });
//   }

//   // Check if the password is correct
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     console.log(`Invalid password for user: ${email}`);
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   console.log(`Login successful for user: ${email}`);

//   // Generate a token with the user's ID and email
//   const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
//   console.log('Generated JWT Token:', token);
//   res.json({ success: true, token });
// });

// // Get user email endpoint (unchanged)
// router.get('/user-email', async (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer')) {
//     console.log('Authorization token missing or invalid');
//     return res.status(401).json({ message: 'Authorization token missing or invalid' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
//     const email = decoded.email;

//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log(`User not found for token email: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ email: user.email });
//   } catch (error) {
//     console.error('Error fetching user email:', error);
//     return res.status(403).json({ message: 'Failed to authenticate token' });
//   }
// });
// module.exports = router;



// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const User = require('../models/User'); 
// const authenticateToken = require('../middleware/auth');
// const router = express.Router();

// // Secret for JWT
// const JWT_SECRET = 'your_jwt_secret';

// // Nodemailer transporter configuration
// const transporter = nodemailer.createTransport({
//   host: 'mail.samparkai.com',
//   port: 587,
//   secure: false, // TLS
//   auth: {
//     user: 'connect@samparkai.com',
//     pass: 'sakshi',
//   },
//   tls: {
//     rejectUnauthorized: false, 
//   },
// });

// // Helper function to generate OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// };

// // Helper function to send OTP via email
// const sendOTP = async (email, otp) => {
//   try {
//     await transporter.sendMail({
//       from: '"SamparkAI" <connect@samparkai.com>',
//       to: email,
//       subject: 'Your OTP for SamparkAI Signup',
//       text: `Your OTP for verification is: ${otp}`,
//       html: `<b>Your OTP for verification is: ${otp}</b>`,
//     });
//     console.log(`OTP sent to ${email}, otp: "${otp}"`); // Log OTP sent
//   } catch (error) {
//     console.error(`Error sending OTP to ${email}:`, error);
//   }
// };



// // Signup Route with OTP generation and verification
// router.post('/signup', async (req, res) => {
//   console.log('Signup route called'); // Debug statement

//   const { email, password, otp } = req.body; // Include OTP in the request body

//   if (!email || !password) {
//     console.log('Email and password are required for signup');
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   // Check if the user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     console.log(`Signup attempt: User already exists with email ${email}`);
//     return res.status(400).json({ message: 'User already exists' });
//   }

//   // Hash the password before saving
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Generate OTP and send it to user's email
//   const generatedOTP = generateOTP();
//   await sendOTP(email, generatedOTP);

//   // Create a new user with OTP
//   const newUser = new User({ email, password: hashedPassword, otp: generatedOTP });
//   await newUser.save();

//   console.log(`New user created with email: ${newUser.email}`);

//   // If OTP is provided, verify it
//   if (otp) {
//     console.log(`OTP verification attempt for user: ${email}, user otp: "${otp}"`);
//     if (newUser.otp === otp) {
//       console.log(`OTP verification successful for user: ${email}`);
//       newUser.otp = undefined; // Clear OTP after successful verification
//       await newUser.save(); // Save changes
//       const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
//       return res.json({ success: true, token });
//     } else {
//       console.log(`Invalid OTP attempt for user: ${email}`);
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }
//   }

//   res.json({ success: true, message: 'OTP sent to email. Please verify your OTP.' });
// });




// // Verify OTP and generate token
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   console.log(`OTP verification attempt for user: ${email}`);

//   // Check if the user exists
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log(`OTP verification failed: User not found for email ${email}`);
//     return res.status(400).json({ message: 'User not found' });
//   }

//   // Check if the OTP is correct
//   if (user.otp === otp) {
//     console.log(`OTP verification successful for user: ${email}`);
//     // Clear OTP after successful verification
//     user.otp = undefined; // Optional: clear the OTP after verification
//     await user.save(); // Save changes
//     // Generate JWT token after successful OTP verification, including user ID and email
//     const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
//     return res.json({ success: true, token });
//   } else {
//     console.log(`Invalid OTP attempt for user: ${email}`);
//     return res.status(400).json({ message: 'Invalid OTP' });
//   }
// });




// // Login Route
// router.post('/login', async (req, res) => {
//   console.log('Login route called');

//   const { email, password } = req.body;

//   // Check if the user exists
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log(`Login failed: User not found for email ${email}`);
//     return res.status(400).json({ message: 'User does not exist' });
//   }

//   // Check if the password is correct
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     console.log(`Invalid password for user: ${email}`);
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   console.log(`Login successful for user: ${email}`);

//   // Generate a token with the user's ID and email
//   const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
//   console.log('Generated JWT Token:', token);
//   res.json({ success: true, token });
// });




// // Protected Route to Get User Email (Uses authenticateToken Middleware)
// router.get('/user-email', authenticateToken, async (req, res) => {
//   const { email } = req.user;  // Extract email from the authenticated token

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log(`User not found for token email: ${email}`);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ email: user.email });
//   } catch (error) {
//     console.error('Error fetching user email:', error);
//     return res.status(403).json({ message: 'Failed to authenticate token' });
//   }
// });

// module.exports = router;







const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const router = express.Router();



const JWT_SECRET = process.env.JWT_SECRET;


require('dotenv').config(); // Make sure to load environment variables

const transporter = nodemailer.createTransport({
  host: 'mail.samparkai.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,  // Use EMAIL_USER from .env
    pass: process.env.EMAIL_PASS,  // Use EMAIL_PASS from .env
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

// Helper function to send OTP via email
const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: '"Cue Sheet" <connect@samparkai.com>',
      to: email,
      subject: 'Your OTP for MEDai Signup',
      text: `Dear User,

Thank you for using MEDai!

Your One-Time Password (OTP) for login is: ${otp}

Please use this OTP to complete your login process. The OTP is valid for the next 10 minutes.

If you did not request this OTP, please ignore this email.

Best regards,
Psi Team`,
      html: `<p>Dear User,</p>
           <p>Thank you for using <b>MEDai</b>!</p>
           <p>Your One-Time Password (OTP) for login is: <b>${otp}</b></p>
           <p>Please use this OTP to complete your login process. The OTP is valid for the next 10 minutes.</p>
           <p>If you did not request this OTP, please ignore this email.</p>
           <p>Best regards,</p>
           <p><b>Psi Team</b>`,
    });
    console.log(`OTP sent to ${email}, otp: "${otp}"`); // Log OTP sent
  } catch (error) {
    console.error(`Error sending OTP to ${email}:`, error);
  }
};

// Signup Route with OTP generation and verification
router.post('/signup', async (req, res) => {
  console.log('Signup route called'); // Debug statement

  const { email, password, otp } = req.body; // Include OTP in the request body

  if (!email || !password) {
    console.log('Email and password are required for signup');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log(`Signup attempt: User already exists with email ${email}`);
    return res.status(400).json({ message: 'User already exists' });
  }

  // Generate a salt with bcrypt
  const salt = await bcrypt.genSalt(15);  
  console.log(`Generated salt: ${salt}`); 

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(`Hashed password with salt: ${hashedPassword}`); // Debug statement

  // Generate OTP and send it to user's email
  const generatedOTP = generateOTP();
  await sendOTP(email, generatedOTP);

  // Create a new user with OTP
  const newUser = new User({ email, password: hashedPassword, otp: generatedOTP });
  await newUser.save();

  console.log(`New user created with email: ${newUser.email}`);

  // If OTP is provided, verify it
  if (otp) {
    console.log(`OTP verification attempt for user: ${email}, user otp: "${otp}"`);
    if (newUser.otp === otp) {
      console.log(`OTP verification successful for user: ${email}`);
      newUser.otp = undefined; // Clear OTP after successful verification
      await newUser.save(); // Save changes
      const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token });
    } else {
      console.log(`Invalid OTP attempt for user: ${email}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  }

  res.json({ success: true, message: 'OTP sent to email. Please verify your OTP.' });
});

// Verify OTP and generate token
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  console.log(`OTP verification attempt for user: ${email}`);

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`OTP verification failed: User not found for email ${email}`);
    return res.status(400).json({ message: 'User not found' });
  }

  // Check if the OTP is correct
  if (user.otp === otp) {
    console.log(`OTP verification successful for user: ${email}`);
    // Clear OTP after successful verification
    user.otp = undefined; // Optional: clear the OTP after verification
    await user.save(); // Save changes
    // Generate JWT token after successful OTP verification, including user ID and email
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  } else {
    console.log(`Invalid OTP attempt for user: ${email}`);
    return res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Login Route
// router.post('/login', async (req, res) => {
//   console.log('Login route called');

//   const { email, password } = req.body;

//   // Check if the user exists
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log(`Login failed: User not found for email ${email}`);
//     return res.status(400).json({ message: 'User does not exist' });
//   }

//   // Check if the password is correct
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     console.log(`Invalid password for user: ${email}`);
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//   console.log(`Login successful for user: ${email}`);

//   // Generate a token with the user's ID and email
//   const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
//   console.log('Generated JWT Token:', token);
//   res.json({ success: true, token });
// });


router.post('/login', async (req, res) => {
  console.log('Login route called');

  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`Login failed: User not found for email ${email}`);
    return res.status(400).json({ message: 'User does not exist' });
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Invalid password for user: ${email}`);
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  console.log(`Login successful for user: ${email}`);

  // Check if the user is an admin
  const isAdmin = user.isAdmin;
  console.log(`User is${isAdmin ? '' : ' not'} an admin`);

  // Generate a token with the user's ID, email, and admin status
  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: isAdmin },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
  console.log('Generated JWT Token:', token);
  
  res.json({ success: true, token, isAdmin });
});


// Forgot Password Route (sends OTP to the user's email)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`User not found for email: ${email}`);
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate OTP and send it to user's email
  const generatedOTP = generateOTP();
  await sendOTP(email, generatedOTP);

  // Save OTP to the user object in the database
  user.otp = generatedOTP;
  await user.save();

  console.log(`OTP sent to ${email} for password reset`);
  res.status(200).json({ message: 'OTP sent to email. Please verify the OTP to reset your password.' });
});


router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`User not found for email: ${email}`);
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if the OTP matches
  if (user.otp !== otp) {
    console.log(`Invalid OTP attempt for user: ${email}`);
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Hash the new password with a new salt
  const salt = await bcrypt.genSalt(15);  
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the user's password and clear the OTP
  user.password = hashedPassword;
  user.otp = undefined;
  await user.save();

  console.log(`Password reset successful for user: ${email}`);
  res.status(200).json({ success: true, message: 'Password reset successfully' });

});

// Protected Route to Get User Email (Uses authenticateToken Middleware)
router.get('/user-email', authenticateToken, async (req, res) => {
  const { email } = req.user;  // Extract email from the authenticated token

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User not found for token email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ email: user.email });
  } catch (error) {
    console.error('Error fetching user email:', error);
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
});

module.exports = router;
