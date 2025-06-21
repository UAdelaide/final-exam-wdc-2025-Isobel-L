const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({
    userId: req.session.userId,
    role: req.session.role
  });
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = rows[0].user_id;
    req.session.role = rows[0].role;
    res.json({ message: 'login successful!', user: rows[0] });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/dogs', async (req, res) => {
  res.json([
    { dog_id: 12, name: 'Jerry'}
  ]);
  // const ownerId = req.session.userId;

  // if (!ownerId) {
  //   return res.status(401).json({ error: 'Not logged in' });
  // }

  // try {
  //   const [rows] = await db.query(`
  //     // SELECT dog_id, name FROM Dogs WHERE owner_id = ?
  //     // `, [ownerId]);
  //     SELECT dog_id, name FROM Dogs';

  //   res.json(rows);
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to fetch dogs OK?' });
  // }
});

module.exports = router;