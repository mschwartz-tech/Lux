const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
const schedulingRoutes = require('./routes/scheduling');
const invoicesRoutes = require('./routes/invoices');
const workoutPlansRoutes = require('./routes/workout-plans');
const dashboardRoutes = require('./routes/dashboard');
const campaignsRoutes = require('./routes/campaigns');
const usersRoutes = require('./routes/users'); // New users route

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration (assumed to be defined elsewhere)
require('./config/passport')(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/workout-plans', workoutPlansRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/users', usersRoutes); // Register new users route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));