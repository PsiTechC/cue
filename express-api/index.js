// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Import the auth routes
// const tableRoutes = require('./routes/table');
// const projectRoutes = require('./routes/project');
// const paymentRoutes = require('./routes/razorpay')

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://psitech:Psitech123@pms.ijqbdmu.mongodb.net/Cue-Sheet', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('Failed to connect to MongoDB', err));

// // Use auth routes
// app.use('/api/auth', authRoutes);  // Use the '/api/auth' base path
// app.use('/', tableRoutes);
// app.use('/api/project', projectRoutes);
// app.use('/api/payment', paymentRoutes);
// // Start the server
// app.listen(5002, () => {
//   console.log('Server running on port 5002'); // Debug statement
// });


// require('dotenv').config(); 

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); 
// const tableRoutes = require('./routes/table');
// const projectRoutes = require('./routes/project');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// // const paymentRoutes = require('./routes/razorpay');

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(express.static('cue/frontend/build'));

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('Failed to connect to MongoDB', err));

// // Use auth routes
// app.use('/api/auth', authRoutes);  // Use the '/api/auth' base path
// app.use('/', tableRoutes);
// app.use('/api/project', projectRoutes);
// // app.use('/api/payment', paymentRoutes);

// // Start the server
// // app.listen(5002, () => {
// //   console.log('Server running on port 5002'); // Debug statement
// // });


// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// app.use('/api', createProxyMiddleware({
//   target: 'http://localhost:5002', // Your backend server
//   changeOrigin: true,
// }));

//last working
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tableRoutes = require('./routes/table');
const projectRoutes = require('./routes/project');
const path = require('path');
const morgan = require('morgan');
const metadataRoutes = require('./routes/metadata');
const tsRoutes = require('./routes/ts');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Replace this with your actual frontend URL
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.options('*', cors()); // Preflight requests for all routes

// Serve static files from the React app

app.use(morgan('combined')); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// API routes
app.use('/api/auth', authRoutes); // Example API route
app.use('/', tableRoutes);
app.use('/api/project', projectRoutes);

app.use('/api/metadata', metadataRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/ts', tsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res)=>{
  res.send('deployed')
})

// Start the server
const PORT = process.env.PORT || 6006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const tableRoutes = require('./routes/table');
// const projectRoutes = require('./routes/project');
// const path = require('path');
// //const morgan = require('morgan');

// const app = express();
// app.use(express.json());
// app.use(cors());
// const corsOptions = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));



// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'static')));
// //app.use(morgan('combined')); 

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('Failed to connect to MongoDB', err));

// // API routes
// app.use('/api/auth', authRoutes); // Example API route
// app.use('/', tableRoutes);
// app.use('/api/project', projectRoutes);

// // All other requests not caught by the above routes should serve the React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Start the server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
