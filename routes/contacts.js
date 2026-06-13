const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/export', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = 'SELECT name, email, phone, address_street, dob, status, client_types, health_carrier, coverage_type, interested_coverage, current_financial_products, interested_financial_products FROM contacts WHERE 1=1';
    const params = [];
    if (type && type !== 'all') { params.push(`%${type}%`); query += ` AND client_types ILIKE $${params.length}`; }
    if (status && status !== 'all') { params.push(status); query += ` AND status = $${params.length}`; }
    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    const headers = ['Name','Email','Phone','Address','DOB','Status','Client Types','Health Carrier','Coverage Type','Interested Coverage','Current Financial Products','Interested Financial Products'];
    const rows = result.rows.map(r => [
      r.name, r.email, r.phone, r.address_street, r.dob, r.status, r.client_types,
      r.health_carrier, r.coverage_type, r.interested_coverage,
      r.current_financial_products, r.interested_financial_products
    ].map(val => `"${val || ''}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name, first_name, middle_name, last_name,
      email, phone, dob, status, source,
      client_type, client_types,
      smoker, household_size, assigned_to,
      is_married, spouse_first_name, spouse_middle_name, spouse_last_name, spouse_dob,
      address_street, address_suite, address_zip, address_city, address_state, address_county,
      mailing_different, mailing_address,
      health_carrier, health_plan_type, health_plan_type_other, plan_start_date,
      primary_hospital_name, primary_hospital_location,
      physician_name, physician_specialty,
      pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
      spouse_health_carrier, spouse_health_plan_type, spouse_health_plan_type_other, spouse_plan_start_date,
      life_carrier, life_carrier_other, life_plan_type, coverage_type, interested_coverage, life_plan_start_date,
      current_financial_products, interested_financial_products,
      financial_carrier, financial_carrier_other, financial_plan_start_date,
      retirement_goal_age, risk_tolerance, notes, last_contacted
    } = req.body;

    const result = await pool.query(
      `INSERT INTO contacts
        (name, first_name, middle_name, last_name,
         email, phone, dob, status, source,
         client_type, client_types, smoker, household_size, assigned_to,
         is_married, spouse_first_name, spouse_middle_name, spouse_last_name, spouse_dob,
         address_street, address_suite, address_zip, address_city, address_state, address_county,
         mailing_different, mailing_address,
         health_carrier, health_plan_type, health_plan_type_other, plan_start_date,
         primary_hospital_name, primary_hospital_location,
         physician_name, physician_specialty,
         pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
         spouse_health_carrier, spouse_health_plan_type, spouse_health_plan_type_other, spouse_plan_start_date,
         life_carrier, life_carrier_other, life_plan_type, coverage_type, interested_coverage, life_plan_start_date,
         current_financial_products, interested_financial_products,
         financial_carrier, financial_carrier_other, financial_plan_start_date,
         retirement_goal_age, risk_tolerance, notes, last_contacted)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
         $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,
         $40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,$58)
       RETURNING *`,
      [
        name || `${first_name || ''} ${last_name || ''}`.trim(),
        first_name, middle_name, last_name,
        email, phone, dob || null, status, source,
        client_type || null, client_types || null, smoker, household_size || null, assigned_to,
        is_married || false, spouse_first_name, spouse_middle_name, spouse_last_name, spouse_dob || null,
        address_street, address_suite, address_zip, address_city, address_state, address_county,
        mailing_different || false, mailing_address,
        health_carrier, health_plan_type, health_plan_type_other, plan_start_date || null,
        primary_hospital_name, primary_hospital_location,
        physician_name, physician_specialty,
        pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
        spouse_health_carrier, spouse_health_plan_type, spouse_health_plan_type_other, spouse_plan_start_date || null,
        life_carrier, life_carrier_other, life_plan_type, coverage_type, interested_coverage, life_plan_start_date || null,
        current_financial_products, interested_financial_products,
        financial_carrier, financial_carrier_other, financial_plan_start_date || null,
        retirement_goal_age || null, risk_tolerance, notes, last_contacted || null
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, first_name, middle_name, last_name,
      email, phone, dob, status, source,
      client_type, client_types,
      smoker, household_size, assigned_to,
      is_married, spouse_first_name, spouse_middle_name, spouse_last_name, spouse_dob,
      address_street, address_suite, address_zip, address_city, address_state, address_county,
      mailing_different, mailing_address,
      health_carrier, health_plan_type, health_plan_type_other, plan_start_date,
      primary_hospital_name, primary_hospital_location,
      physician_name, physician_specialty,
      pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
      spouse_health_carrier, spouse_health_plan_type, spouse_health_plan_type_other, spouse_plan_start_date,
      life_carrier, life_carrier_other, life_plan_type, coverage_type, interested_coverage, life_plan_start_date,
      current_financial_products, interested_financial_products,
      financial_carrier, financial_carrier_other, financial_plan_start_date,
      retirement_goal_age, risk_tolerance, notes, last_contacted
    } = req.body;

    const result = await pool.query(
      `UPDATE contacts SET
        name=$1, first_name=$2, middle_name=$3, last_name=$4,
        email=$5, phone=$6, dob=$7, status=$8, source=$9,
        client_type=$10, client_types=$11, smoker=$12, household_size=$13, assigned_to=$14,
        is_married=$15, spouse_first_name=$16, spouse_middle_name=$17, spouse_last_name=$18, spouse_dob=$19,
        address_street=$20, address_suite=$21, address_zip=$22, address_city=$23, address_state=$24, address_county=$25,
        mailing_different=$26, mailing_address=$27,
        health_carrier=$28, health_plan_type=$29, health_plan_type_other=$30, plan_start_date=$31,
        primary_hospital_name=$32, primary_hospital_location=$33,
        physician_name=$34, physician_specialty=$35,
        pharmacy_name=$36, pharmacy_other=$37, pharmacy_address=$38, pharmacy_phone=$39,
        spouse_health_carrier=$40, spouse_health_plan_type=$41, spouse_health_plan_type_other=$42, spouse_plan_start_date=$43,
        life_carrier=$44, life_carrier_other=$45, life_plan_type=$46, coverage_type=$47, interested_coverage=$48, life_plan_start_date=$49,
        current_financial_products=$50, interested_financial_products=$51,
        financial_carrier=$52, financial_carrier_other=$53, financial_plan_start_date=$54,
        retirement_goal_age=$55, risk_tolerance=$56, notes=$57, last_contacted=$58
       WHERE id=$59 RETURNING *`,
      [
        name || `${first_name || ''} ${last_name || ''}`.trim(),
        first_name, middle_name, last_name,
        email, phone, dob || null, status, source,
        client_type || null, client_types || null, smoker, household_size || null, assigned_to,
        is_married || false, spouse_first_name, spouse_middle_name, spouse_last_name, spouse_dob || null,
        address_street, address_suite, address_zip, address_city, address_state, address_county,
        mailing_different || false, mailing_address,
        health_carrier, health_plan_type, health_plan_type_other, plan_start_date || null,
        primary_hospital_name, primary_hospital_location,
        physician_name, physician_specialty,
        pharmacy_name, pharmacy_other, pharmacy_address, pharmacy_phone,
        spouse_health_carrier, spouse_health_plan_type, spouse_health_plan_type_other, spouse_plan_start_date || null,
        life_carrier, life_carrier_other, life_plan_type, coverage_type, interested_coverage, life_plan_start_date || null,
        current_financial_products, interested_financial_products,
        financial_carrier, financial_carrier_other, financial_plan_start_date || null,
        retirement_goal_age || null, risk_tolerance, notes, last_contacted || null,
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

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