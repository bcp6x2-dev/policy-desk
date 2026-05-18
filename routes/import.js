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
const address = rowObj[mapping.address] || '';
const dobRaw = rowObj[mapping.dob] || '';

if (!name) { skipped++; continue; }

let dob = null;
if (dobRaw) {
try {
if (typeof dobRaw === 'number') {
const date = XLSX.SSF.parse_date_code(dobRaw);
dob = `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
} else {
const parsed = new Date(dobRaw);
if (!isNaN(parsed)) dob = parsed.toISOString().split('T')[0];
}
} catch(e) { dob = null; }
}

try {
await pool.query(
'INSERT INTO contacts (name, email, phone, address, dob, status, source, client_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
[name, email || null, phone || null, address || null, dob, 'lead', 'imported', 'insurance']
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