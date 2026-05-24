const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'policydesk_secret_key';

// Middleware to verify admin
async function requireAdmin(req, res, next) {
try {
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ error: 'No token' });
const decoded = jwt.verify(token, SECRET);
if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
req.user = decoded;
next();
} catch (err) {
res.status(401).json({ error: 'Invalid token' });
}
}

// GET all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
try {
const result = await pool.query(
'SELECT id, name, email, role, active, created_at FROM users ORDER BY created_at DESC'
);
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

// POST create a new user (admin only)
router.post('/', requireAdmin, async (req, res) => {
try {
const { name, email, password, role } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
const result = await pool.query(
'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, active',
[name, email, hashedPassword, role || 'employee']
);
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

// PUT update user (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
try {
const { id } = req.params;
const { name, email, role, active } = req.body;
const result = await pool.query(
'UPDATE users SET name=$1, email=$2, role=$3, active=$4 WHERE id=$5 RETURNING id, name, email, role, active',
[name, email, role, active, id]
);
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

// DELETE user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
try {
const { id } = req.params;
await pool.query('DELETE FROM users WHERE id = $1', [id]);
res.json({ message: 'User deleted' });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

module.exports = router;