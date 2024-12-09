
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

app.use((req, res, next) => {
  console.log('CORS Debug:', {
    origin: req.headers.origin,
    allowed: process.env.REACT_FE,
  });
  next();
});

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
