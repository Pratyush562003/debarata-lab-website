const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<db_password>')) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      console.log('Server is running, but database operations will fail.');
    });
} else {
  console.warn('WARNING: MONGO_URI is missing or contains placeholder <db_password>. Database connection skipped.');
}

// Routes
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return res.status(500).json({ error: 'Server configuration error: Admin password hash is not set in .env.' });
    }

    if (username !== adminUser) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'default_secret_key_123',
      { expiresIn: '24h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('Login route error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Lab website backend is running!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
