import React, { useState } from 'react';

const API = 'https://policy-desk-production.up.railway.app';

function ImportTool({ onClose, onImported }) {
const [step, setStep] = useState(1);
const [file, setFile] = useState(null);
const [headers, setHeaders] = useState([]);
const [preview, setPreview] = useState([]);
const [totalRows, setTotalRows] = useState(0);
const [mapping, setMapping] = useState({ name: '', email: '', phone: '', address: '', dob: '' });
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const s = {
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: 'white', borderRadius: '12px', width: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
header: { backgroundColor: '#2B5C2B', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
body: { padding: '24px', overflowY: 'auto', flex: 1 },
footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
btn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: '#2B5C2B', color: 'white', fontWeight: '600' },
cancelBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' },
goldBtn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: '#C9A227', color: 'white', fontWeight: '600' },
label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
select: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' },
table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
th: { backgroundColor: '#2B5C2B', color: 'white', padding: '8px 12px', textAlign: 'left' },
td: { padding: '8px 12px', borderBottom: '1px solid #eee' },
stepIndicator: { display: 'flex', gap: '8px', marginBottom: '20px' },
step: (active) => ({ padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: active ? '700' : '400', backgroundColor: active ? '#2B5C2B' : '#eee', color: active ? 'white' : '#555' }),
};

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
if (!mapping.name) { alert('Please map the Name column'); return; }
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
{file && <p style={{ color: '#2B5C2B', fontSize: '14px' }}>✅ {file.name} selected</p>}
</div>
)}

{step === 2 && (
<div>
<p style={{ color: '#555', marginBottom: '16px' }}>We found <strong>{totalRows} rows</strong> and <strong>{headers.length} columns</strong>. Match your columns to the contact fields below.</p>

{['name', 'email', 'phone', 'address', 'dob'].map(field => (
<div key={field}>
<label style={s.label}>{field === 'dob' ? 'Date of Birth' : field.charAt(0).toUpperCase() + field.slice(1)} {field === 'name' ? '*' : ''}</label>
<select style={s.select} value={mapping[field]} onChange={e => setMapping({ ...mapping, [field]: e.target.value })}>
<option value="">-- Skip this field --</option>
{headers.map(h => <option key={h} value={h}>{h}</option>)}
</select>
</div>
))}

<p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Preview (first 5 rows):</p>
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
<h2 style={{ color: '#2B5C2B' }}>Import Complete!</h2>
<p style={{ fontSize: '18px' }}><strong>{result.imported}</strong> contacts imported successfully</p>
{result.skipped > 0 && <p style={{ color: '#888' }}>{result.skipped} rows skipped (missing name or duplicate)</p>}
</div>
)}
</div>

<div style={s.footer}>
{step === 1 && <>
<button style={s.cancelBtn} onClick={onClose}>Cancel</button>
<button style={s.goldBtn} onClick={handleUpload} disabled={!file || loading}>{loading ? 'Reading...' : 'Next →'}</button>
</>}
{step === 2 && <>
<button style={s.cancelBtn} onClick={() => setStep(1)}>← Back</button>
<button style={s.goldBtn} onClick={handleImport} disabled={loading}>{loading ? 'Importing...' : `Import ${totalRows} Contacts`}</button>
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