const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dotenv = require('dotenv');
const path = require('path');

// Specify the correct path to the config.env file
const envPath = path.resolve(__dirname, 'config', 'config.env');
// console.log(envPath)
dotenv.config({ path: envPath });
// console.log(process.env.JWT_SECRET);

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
