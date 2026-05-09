const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'policydesk_secret_key';

// POST /api/auth/login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;

// Find user by email
const result = await pool.query(
'SELECT * FROM users WHERE email = $1 AND active = true',
[email]
);

if (result.rows.length === 0) {
return res.status(401).json({ error: 'Invalid email or password' });
}

const user = result.rows[0];

// Check password
const validPassword = password === user.password ||
await bcrypt.compare(password, user.password);

if (!validPassword) {
return res.status(401).json({ error: 'Invalid email or password' });
}

// Create token
const token = jwt.sign(
{ id: user.id, email: user.email, role: user.role, name: user.name },
SECRET,
{ expiresIn: '8h' }
);

res.json({
token,
user: { id: user.id, name: user.name, email: user.email, role: user.role }
});

} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
try {
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ error: 'No token' });

const decoded = jwt.verify(token, SECRET);
res.json(decoded);
} catch (err) {
res.status(401).json({ error: 'Invalid token' });
}
});

module.exports = router;