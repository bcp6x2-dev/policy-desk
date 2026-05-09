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
const { name, email, phone, address, dob, status, source, client_type, smoker, household_size, current_carrier, coverage_type, plan_type, renewal_date, interested_coverage, current_financial_products, interested_financial_products, retirement_goal_age, risk_tolerance, notes, last_contacted } = req.body;

const result = await pool.query(
'INSERT INTO contacts (name, email, phone, address, dob, status, source, client_type, smoker, household_size, current_carrier, coverage_type, plan_type, renewal_date, interested_coverage, current_financial_products, interested_financial_products, retirement_goal_age, risk_tolerance, notes, last_contacted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *',
[name, email, phone, address, dob, status, source, client_type, smoker, household_size, current_carrier, coverage_type, plan_type, renewal_date, interested_coverage, current_financial_products, interested_financial_products, retirement_goal_age, risk_tolerance, notes, last_contacted]

);
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});
// PUT update a contact
router.put('/:id', async (req, res) => {
try {
const { id } = req.params;
const { name, email, phone, address, dob, status, source, client_type, smoker, household_size, current_carrier, coverage_type, plan_type, renewal_date, interested_coverage, current_financial_products, interested_financial_products, retirement_goal_age, risk_tolerance, notes, last_contacted } = req.body;
const result = await pool.query(
'UPDATE contacts SET name=$1, email=$2, phone=$3, address=$4, dob=$5, status=$6, source=$7, client_type=$8, smoker=$9, household_size=$10, current_carrier=$11, coverage_type=$12, plan_type=$13, renewal_date=$14, interested_coverage=$15, current_financial_products=$16, interested_financial_products=$17, retirement_goal_age=$18, risk_tolerance=$19, notes=$20, last_contacted=$21 WHERE id=$22 RETURNING *',
[name, email, phone, address, dob, status, source, client_type, smoker, household_size, current_carrier, coverage_type, plan_type, renewal_date, interested_coverage, current_financial_products, interested_financial_products, retirement_goal_age, risk_tolerance, notes, last_contacted, id]
);
res.json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});
module.exports = router;