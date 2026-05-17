const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const pool = require('../db');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/import/preview - upload and preview columns
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

// POST /api/import/confirm - import all rows
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
headers.forEach((h, i) => rowObj[h] = row[i] || '');

const contact = {
name: rowObj[mapping.name] || '',
email: rowObj[mapping.email] || '',
phone: rowObj[mapping.phone] || '',
address: rowObj[mapping.address] || '',
dob: rowObj[mapping.dob] || null,
status: 'lead',
source: 'imported',
client_type: 'insurance',
};

if (!contact.name) { skipped++; continue; }

try {
await pool.query(
'INSERT INTO contacts (name, email, phone, address, dob, status, source, client_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
[contact.name, contact.email, contact.phone, contact.address, contact.dob, contact.status, contact.source, contact.client_type]
);
imported++;
} catch (e) {
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