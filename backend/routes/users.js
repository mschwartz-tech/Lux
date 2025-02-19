const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Middleware for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create User Route
router.post('/users', [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').isLength({ min: 8 }).trim(),
  body('name').notEmpty().trim(),
], validate, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Simulate user creation (replace with actual database logic)
    const user = { email, name, password: 'hashed-password' }; // Hash password in production
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile Route
router.put('/users/:id', [
  body('email').optional().isEmail().normalizeEmail().trim(),
  body('name').optional().notEmpty().trim(),
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Simulate user update (replace with actual database logic)
    res.status(200).json({ message: 'User updated successfully', updates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;