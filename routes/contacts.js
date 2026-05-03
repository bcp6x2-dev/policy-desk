const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all contacts
router.get('/', async (req, res) => {
try {
const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

// POST create a new contact
router.post('/', async (req, res) => {
try {
const { name, email, phone, address, dob, status, source } = req.body;
const result = await pool.query(
'INSERT INTO contacts (name, email, phone, address, dob, status, source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
[name, email, phone, address, dob, status, source]
);
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});

module.exports = router;