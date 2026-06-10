const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET notes for a contact
router.get('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await pool.query(
      'SELECT * FROM notes WHERE contact_id = $1 ORDER BY created_at DESC',
      [contactId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new note
router.post('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const { body, broker_name } = req.body;
    const result = await pool.query(
      'INSERT INTO notes (contact_id, body, broker_name) VALUES ($1, $2, $3) RETURNING *',
      [contactId, body, broker_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;