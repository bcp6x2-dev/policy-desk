const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const pool = require('../db');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/preview', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = data[0];
    const preview = data.slice(1, 6).map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i] || '');
      return obj;
    });

    res.json({ headers, preview, totalRows: data.length - 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

router.post('/confirm', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = data[0];
    const mapping = JSON.parse(req.body.mapping);
    const rows = data.slice(1);

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const rowObj = {};
      headers.forEach((h, i) => rowObj[h] = row[i] !== undefined ? String(row[i]).trim() : '');

      const name = rowObj[mapping.name] || '';
      const email = rowObj[mapping.email] || '';
      const phone = rowObj[mapping.phone] || '';
      const dob_raw = rowObj[mapping.dob] || '';
      const first_name = rowObj[mapping.first_name] || '';
      const last_name = rowObj[mapping.last_name] || '';
      const address_street = rowObj[mapping.address_street] || rowObj[mapping.address] || '';
      const address_city = rowObj[mapping.address_city] || '';
      const address_state = rowObj[mapping.address_state] || '';
      const address_zip = rowObj[mapping.address_zip] || '';
      const address_county = rowObj[mapping.address_county] || '';
      const health_carrier = rowObj[mapping.health_carrier] || '';
      const health_plan_type = rowObj[mapping.health_plan_type] || '';
      const financial_carrier = rowObj[mapping.financial_carrier] || '';
      const financial_plan_start_date_raw = rowObj[mapping.financial_plan_start_date] || '';
      const assigned_to = rowObj[mapping.assigned_to] || 'Terrell Lane';
      const status = rowObj[mapping.status] || 'lead';
      const client_types = rowObj[mapping.client_types] || '';
      const mbi_number = rowObj[mapping.mbi_number] || '';

      if (!name && !first_name) { skipped++; continue; }

      const finalName = name || `${first_name} ${last_name}`.trim();

      let dob = null;
      if (dob_raw) {
        try {
          if (!isNaN(dob_raw) && dob_raw < 100000) {
            const date = XLSX.SSF.parse_date_code(Number(dob_raw));
            dob = `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
          } else {
            const parsed = new Date(dob_raw);
            if (!isNaN(parsed)) dob = parsed.toISOString().split('T')[0];
          }
        } catch(e) { dob = null; }
      }

      let financial_plan_start_date = null;
      if (financial_plan_start_date_raw) {
        try {
          if (!isNaN(financial_plan_start_date_raw) && financial_plan_start_date_raw < 100000) {
            const date = XLSX.SSF.parse_date_code(Number(financial_plan_start_date_raw));
            financial_plan_start_date = `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
          } else {
            const parsed = new Date(financial_plan_start_date_raw);
            if (!isNaN(parsed)) financial_plan_start_date = parsed.toISOString().split('T')[0];
          }
        } catch(e) { financial_plan_start_date = null; }
      }

      try {
        await pool.query(
          `INSERT INTO contacts
            (name, first_name, last_name, email, phone, dob, status, source,
             client_types, assigned_to,
             address_street, address_city, address_state, address_zip, address_county,
             health_carrier, health_plan_type,
             financial_carrier, financial_plan_start_date,
             mbi_number)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
           ON CONFLICT DO NOTHING`,
          [
            finalName,
            first_name || null,
            last_name || null,
            email || null,
            phone || null,
            dob,
            status,
            'imported',
            client_types || null,
            assigned_to,
            address_street || null,
            address_city || null,
            address_state || null,
            address_zip || null,
            address_county || null,
            health_carrier || null,
            health_plan_type || null,
            financial_carrier || null,
            financial_plan_start_date,
            mbi_number || null
          ]
        );
        imported++;
      } catch (e) {
        console.error('Row insert error:', e.message);
        skipped++;
      }
    }

    res.json({ imported, skipped, total: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Import failed' });
  }
});

module.exports = router;