const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET reminders for the logged-in broker
router.get('/', async (req, res) => {
  try {
    const { broker } = req.query;
    const result = await pool.query(
      `SELECT r.*, c.name as client_name, c.first_name, c.last_name
       FROM reminders r
       JOIN contacts c ON r.contact_id = c.id
       WHERE r.broker_name = $1
       ORDER BY r.reminder_date ASC`,
      [broker]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET unread count for the logged-in broker
router.get('/unread-count', async (req, res) => {
  try {
    const { broker } = req.query;
    const result = await pool.query(
      `SELECT COUNT(*) FROM reminders
       WHERE broker_name = $1 AND is_read = FALSE AND reminder_date <= CURRENT_DATE`,
      [broker]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create a reminder (called when financial plan start date is saved)
router.post('/', async (req, res) => {
  try {
    const { contact_id, broker_name, plan_start_date } = req.body;
    if (!plan_start_date) return res.status(400).json({ error: 'plan_start_date required' });

    // Calculate 11 months from plan start date
    const reminderDate = new Date(plan_start_date + 'T12:00:00'); const reminderDate = new DATE(startDATE);    
    reminderDate.setMonth(reminderDate.getMonth() + 11);

    // Delete any existing reminder for this contact to avoid duplicates
    await pool.query('DELETE FROM reminders WHERE contact_id = $1', [contact_id]);

    const result = await pool.query(
      `INSERT INTO reminders (contact_id, broker_name, reminder_date, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        contact_id,
        broker_name,
        reminderDate.toISOString().split('T')[0],
        `Allocation review due for this client — 11 months since plan start date.`
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT mark a reminder as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE reminders SET is_read = TRUE WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT mark all reminders as read for a broker
router.put('/mark-all-read', async (req, res) => {
  try {
    const { broker } = req.query;
    await pool.query('UPDATE reminders SET is_read = TRUE WHERE broker_name = $1', [broker]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;