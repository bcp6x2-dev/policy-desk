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

// GET export contacts as CSV
router.get('/export', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = 'SELECT name, email, phone, address_street, address_city, address_state, address_zip, dob, status, client_types, health_carrier, life_carrier, financial_carrier FROM contacts WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      params.push(type);
      query += ` AND client_type = $${params.length}`;
    }
    if (status && status !== 'all') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY last_name, first_name';
    const result = await pool.query(query, params);

    const headers = ['Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Zip', 'DOB', 'Status', 'Client Types', 'Health Carrier', 'Life Carrier', 'Financial Carrier'];
    const rows = result.rows.map(r => [
      r.name, r.email, r.phone, r.address_street, r.address_city, r.address_state, r.address_zip,
      r.dob, r.status, r.client_types, r.health_carrier, r.life_carrier, r.financial_carrier
    ].map(val => `"${val || ''}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=policydesk-export.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create a new contact
router.post('/', async (req, res) => {
  try {
    const {
      name, email, phone, address, dob, status, source, client_type, smoker,
      household_size, coverage_type, plan_type, renewal_date, interested_coverage,
      current_financial_products, interested_financial_products, retirement_goal_age,
      risk_tolerance, notes, last_contacted,
      first_name, middle_name, last_name,
      is_married, spouse_first_name, spouse_middle_name, spouse_last_name,
      address_street, address_suite, address_zip, address_city, address_state, address_county,
      mailing_different, mailing_address, client_types,
      health_carrier, health_plan_type, health_plan_type_other,
      primary_hospital_name, primary_hospital_location,
      physician_name, physician_specialty,
      pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
      life_carrier, life_carrier_other, life_plan_type,
      financial_carrier, financial_carrier_other, plan_start_date
    } = req.body;

    const fullName = name || `${first_name || ''} ${middle_name || ''} ${last_name || ''}`.trim();

    const result = await pool.query(
      `INSERT INTO contacts (
        name, email, phone, address, dob, status, source, client_type, smoker,
        household_size, coverage_type, plan_type, renewal_date, interested_coverage,
        current_financial_products, interested_financial_products, retirement_goal_age,
        risk_tolerance, notes, last_contacted,
        first_name, middle_name, last_name,
        is_married, spouse_first_name, spouse_middle_name, spouse_last_name,
        address_street, address_suite, address_zip, address_city, address_state, address_county,
        mailing_different, mailing_address, client_types,
        health_carrier, health_plan_type, health_plan_type_other,
        primary_hospital_name, primary_hospital_location,
        physician_name, physician_specialty,
        pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
        life_carrier, life_carrier_other, life_plan_type,
        financial_carrier, financial_carrier_other, plan_start_date
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,
        $37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53
      ) RETURNING *`,
      [
        fullName, email, phone, address_street, dob, status || 'lead', source || 'manual', client_type || 'insurance', smoker,
        household_size, coverage_type, plan_type, renewal_date, interested_coverage,
        current_financial_products, interested_financial_products, retirement_goal_age,
        risk_tolerance, notes, last_contacted,
        first_name, middle_name, last_name,
        is_married, spouse_first_name, spouse_middle_name, spouse_last_name,
        address_street, address_suite, address_zip, address_city, address_state, address_county,
        mailing_different, mailing_address, client_types,
        health_carrier, health_plan_type, health_plan_type_other,
        primary_hospital_name, primary_hospital_location,
        physician_name, physician_specialty,
        pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
        life_carrier, life_carrier_other, life_plan_type,
        financial_carrier, financial_carrier_other, plan_start_date
      ]
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
    const {
      name, email, phone, address, dob, status, source, client_type, smoker,
      household_size, coverage_type, plan_type, renewal_date, interested_coverage,
      current_financial_products, interested_financial_products, retirement_goal_age,
      risk_tolerance, notes, last_contacted,
      first_name, middle_name, last_name,
      is_married, spouse_first_name, spouse_middle_name, spouse_last_name,
      address_street, address_suite, address_zip, address_city, address_state, address_county,
      mailing_different, mailing_address, client_types,
      health_carrier, health_plan_type, health_plan_type_other,
      primary_hospital_name, primary_hospital_location,
      physician_name, physician_specialty,
      pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
      life_carrier, life_carrier_other, life_plan_type,
      financial_carrier, financial_carrier_other, plan_start_date
    } = req.body;

    const fullName = name || `${first_name || ''} ${middle_name || ''} ${last_name || ''}`.trim();

    const result = await pool.query(
      `UPDATE contacts SET
        name=$1, email=$2, phone=$3, address=$4, dob=$5, status=$6, source=$7, client_type=$8, smoker=$9,
        household_size=$10, coverage_type=$11, plan_type=$12, renewal_date=$13, interested_coverage=$14,
        current_financial_products=$15, interested_financial_products=$16, retirement_goal_age=$17,
        risk_tolerance=$18, notes=$19, last_contacted=$20,
        first_name=$21, middle_name=$22, last_name=$23,
        is_married=$24, spouse_first_name=$25, spouse_middle_name=$26, spouse_last_name=$27,
        address_street=$28, address_suite=$29, address_zip=$30, address_city=$31, address_state=$32, address_county=$33,
        mailing_different=$34, mailing_address=$35, client_types=$36,
        health_carrier=$37, health_plan_type=$38, health_plan_type_other=$39,
        primary_hospital_name=$40, primary_hospital_location=$41,
        physician_name=$42, physician_specialty=$43,
        pharmacy_name=$44, pharmacy_other=$45, pharmacy_address=$46, pharmacy_phone=$47,
        life_carrier=$48, life_carrier_other=$49, life_plan_type=$50,
        financial_carrier=$51, financial_carrier_other=$52, plan_start_date=$53
      WHERE id=$54 RETURNING *`,
      [
        fullName, email, phone, address_street, dob, status, source, client_type, smoker,
        household_size, coverage_type, plan_type, renewal_date, interested_coverage,
        current_financial_products, interested_financial_products, retirement_goal_age,
        risk_tolerance, notes, last_contacted,
        first_name, middle_name, last_name,
        is_married, spouse_first_name, spouse_middle_name, spouse_last_name,
        address_street, address_suite, address_zip, address_city, address_state, address_county,
        mailing_different, mailing_address, client_types,
        health_carrier, health_plan_type, health_plan_type_other,
        primary_hospital_name, primary_hospital_location,
        physician_name, physician_specialty,
        pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
        life_carrier, life_carrier_other, life_plan_type,
        financial_carrier, financial_carrier_other, plan_start_date,
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a single contact
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE all contacts
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts');
    res.json({ message: 'All contacts deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;