import React, { useState } from 'react';

const API = 'https://policy-desk-production.up.railway.app';

function ImportTool({ onClose, onImported }) {
const [step, setStep] = useState(1);
const [file, setFile] = useState(null);
const [headers, setHeaders] = useState([]);
const [preview, setPreview] = useState([]);
const [totalRows, setTotalRows] = useState(0);
const [mapping, setMapping] = useState({
  name: '', first_name: '', last_name: '', email: '', phone: '', dob: '',
  address_street: '', address_suite: '', address_city: '', address_state: '', address_zip: '', address_county: '',
  health_carrier: '', health_plan_type: '',
  financial_carrier: '', financial_plan_start_date: '',
  client_types: '', assigned_to: '', status: '', mbi_number: '', medicaid_number: '', spouse_mbi_number: '', spouse_medicaid_number: ''
});
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const RED = '#851D21';
const BLACK = '#303030';

const s = {
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: 'white', borderRadius: '12px', width: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
header: { backgroundColor: BLACK, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid ' + RED },
headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
body: { padding: '24px', overflowY: 'auto', flex: 1 },
footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
btn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: BLACK, color: 'white', fontWeight: '600' },
cancelBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' },
redBtn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: RED, color: 'white', fontWeight: '600' },
label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
select: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' },
table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
th: { backgroundColor: BLACK, color: 'white', padding: '8px 12px', textAlign: 'left' },
td: { padding: '8px 12px', borderBottom: '1px solid #eee' },
stepIndicator: { display: 'flex', gap: '8px', marginBottom: '20px' },
step: (active) => ({ padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: active ? '700' : '400', backgroundColor: active ? RED : '#eee', color: active ? 'white' : '#555' }),
sectionHeader: { fontSize: '12px', fontWeight: '700', color: RED, textTransform: 'uppercase', marginBottom: '8px', marginTop: '16px', paddingBottom: '4px', borderBottom: '1px solid #F5E8E8' },
};

const fieldGroups = [
  {
    title: 'Name & Contact',
    fields: [
      { key: 'name', label: 'Full Name *' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'mbi_number', label: 'MBI # (Medicare Beneficiary ID)' },
      { key: 'medicaid_number', label: 'Medicaid #' },
    ]
  },
  {
    title: 'Address',
    fields: [
      { key: 'address_street', label: 'Street Address' },
      { key: 'address_suite', label: 'Address Line 2 / Apt' },
      { key: 'address_city', label: 'City' },
      { key: 'address_state', label: 'State' },
      { key: 'address_zip', label: 'Zip Code' },
      { key: 'address_county', label: 'County' },
    ]
  },
  {
    title: 'Health Insurance',
    fields: [
      { key: 'health_carrier', label: 'Health Carrier' },
      { key: 'health_plan_type', label: 'Health Plan Type' },
    ]
  },
  {
    title: 'Financial',
    fields: [
      { key: 'financial_carrier', label: 'Financial Carrier' },
      { key: 'financial_plan_start_date', label: 'Financial Plan Start Date' },
    ]
  },
  {
    title: 'Client Info',
    fields: [
      { key: 'client_types', label: 'Client Type(s)' },
      { key: 'assigned_to', label: 'Assigned Broker' },
      { key: 'status', label: 'Status' },
    ]
  },
];

async function handleUpload() {
if (!file) return;
setLoading(true);
const formData = new FormData();
formData.append('file', file);
try {
const res = await fetch(`${API}/api/import/preview`, { method: 'POST', body: formData });
const data = await res.json();
setHeaders(data.headers);
setPreview(data.preview);
setTotalRows(data.totalRows);
setStep(2);
} catch (err) {
alert('Failed to read file');
}
setLoading(false);
}

async function handleImport() {
if (!mapping.name && !mapping.first_name) { alert('Please map either the Full Name or First Name column'); return; }
setLoading(true);
const formData = new FormData();
formData.append('file', file);
formData.append('mapping', JSON.stringify(mapping));
try {
const res = await fetch(`${API}/api/import/confirm`, { method: 'POST', body: formData });
const data = await res.json();
setResult(data);
setStep(3);
} catch (err) {
alert('Import failed');
}
setLoading(false);
}

return (
<div style={s.overlay}>
<div style={s.modal}>
<div style={s.header}>
<h2 style={s.headerTitle}>📥 Import Contacts from Excel</h2>
<button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
</div>

<div style={s.body}>
<div style={s.stepIndicator}>
{['1. Upload File', '2. Map Columns', '3. Complete'].map((label, i) => (
<span key={i} style={s.step(step === i + 1)}>{label}</span>
))}
</div>

{step === 1 && (
<div>
<p style={{ color: '#555', marginBottom: '20px' }}>Upload your Excel or CSV file. We'll read the columns and let you match them to the right fields.</p>
<label style={s.label}>Select File (.xlsx, .xls, .csv)</label>
<input
type="file"
accept=".xlsx,.xls,.csv"
onChange={e => setFile(e.target.files[0])}
style={{ marginBottom: '16px', display: 'block' }}
/>
{file && <p style={{ color: RED, fontSize: '14px' }}>✅ {file.name} selected</p>}
</div>
)}

{step === 2 && (
<div>
<p style={{ color: '#555', marginBottom: '8px' }}>We found <strong>{totalRows} rows</strong> and <strong>{headers.length} columns</strong>. Match your columns to the contact fields below. All fields except Full Name are optional.</p>

{fieldGroups.map(group => (
<div key={group.title}>
<p style={s.sectionHeader}>{group.title}</p>
{group.fields.map(field => (
<div key={field.key}>
<label style={s.label}>{field.label}</label>
<select style={s.select} value={mapping[field.key]} onChange={e => setMapping({ ...mapping, [field.key]: e.target.value })}>
<option value="">-- Skip this field --</option>
{headers.map(h => <option key={h} value={h}>{h}</option>)}
</select>
</div>
))}
</div>
))}

<p style={{ fontSize: '13px', color: '#888', marginBottom: '8px', marginTop: '16px' }}>Preview (first 5 rows):</p>
<div style={{ overflowX: 'auto' }}>
<table style={s.table}>
<thead>
<tr>{headers.map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
</thead>
<tbody>
{preview.map((row, i) => (
<tr key={i}>{headers.map(h => <td key={h} style={s.td}>{row[h]}</td>)}</tr>
))}
</tbody>
</table>
</div>
</div>
)}

{step === 3 && result && (
<div style={{ textAlign: 'center', padding: '40px 0' }}>
<div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
<h2 style={{ color: RED }}>Import Complete!</h2>
<p style={{ fontSize: '18px' }}><strong>{result.imported}</strong> contacts imported successfully</p>
{result.skipped > 0 && <p style={{ color: '#888' }}>{result.skipped} rows skipped (missing name or duplicate)</p>}
</div>
)}
</div>

<div style={s.footer}>
{step === 1 && <>
<button style={s.cancelBtn} onClick={onClose}>Cancel</button>
<button style={s.redBtn} onClick={handleUpload} disabled={!file || loading}>{loading ? 'Reading...' : 'Next →'}</button>
</>}
{step === 2 && <>
<button style={s.cancelBtn} onClick={() => setStep(1)}>← Back</button>
<button style={s.redBtn} onClick={handleImport} disabled={loading}>{loading ? 'Importing...' : `Import ${totalRows} Contacts`}</button>
</>}
{step === 3 && <>
<button style={s.btn} onClick={() => { onImported(); onClose(); }}>View Contacts</button>
</>}
</div>
</div>
</div>
);
}

export default ImportTool;