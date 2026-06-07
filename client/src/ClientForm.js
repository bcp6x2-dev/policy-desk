import React, { useState } from 'react';

function ClientForm({ onSave, onClose }) {
const [form, setForm] = useState({
name: '', email: '', phone: '', address: '', dob: '',
status: 'lead', source: 'manual', client_type: 'insurance',
smoker: false, household_size: '', current_carrier: '',
coverage_type: '', plan_type: '', renewal_date: '',
interested_coverage: '', current_financial_products: '',
interested_financial_products: '', retirement_goal_age: '',
risk_tolerance: '', notes: '', last_contacted: ''
});

const [activeTab, setActiveTab] = useState('demographics');
const [error, setError] = useState('');

function handleChange(e) {
const { name, value, type, checked } = e.target;
setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
}

async function handleSubmit(e) {
e.preventDefault();
setError('');
try {
const token = localStorage.getItem('token');
const res = await fetch('https://policy-desk-production.up.railway.app/api/contacts', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${token}`
},
body: JSON.stringify(form),
});
if (!res.ok) {
const err = await res.json();
setError(err.message || 'Failed to save client.');
return;
}
const data = await res.json();
onSave(data);
onClose();
} catch (err) {
console.error(err);
setError('Network error. Please try again.');
}
}

const s = {
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: 'white', borderRadius: '12px', width: '620px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
header: { backgroundColor: '#2B5C2B', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
tabs: { display: 'flex', borderBottom: '2px solid #E0E0E0', backgroundColor: '#F8F9FA' },
tab: (active) => ({ padding: '12px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: active ? '700' : '400', color: active ? '#2B5C2B' : '#666', borderBottom: active ? '2px solid #2B5C2B' : 'none', backgroundColor: 'transparent', border: 'none', marginBottom: '-2px' }),
body: { padding: '24px', overflowY: 'auto', flex: 1, maxHeight: '60vh' },
row: { display: 'flex', gap: '12px', marginBottom: '12px' },
col: { flex: 1 },
label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
input: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
select: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
textarea: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' },
sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#2B5C2B', textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #E8F0FA' },
footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
cancelBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' },
saveBtn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: '#C9A227', color: 'white', fontWeight: '600' },
errorMsg: { color: '#c0392b', fontSize: '13px' },
};

return (
<div style={s.overlay}>
<div style={s.modal}>
<div style={s.header}>
<h2 style={s.headerTitle}>New Client Profile</h2>
<button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
</div>

<div style={s.tabs}>
{['demographics', 'insurance', 'financial', 'notes'].map(tab => (
<button key={tab} style={s.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
{tab === 'demographics' ? '👤 Demographics' : tab === 'insurance' ? '🏥 Insurance' : tab === 'financial' ? '💰 Financial' : '📝 Notes'}
</button>
))}
</div>

<form onSubmit={handleSubmit}>
<div style={s.body}>

{activeTab === 'demographics' && (
<div>
<p style={s.sectionTitle}>Basic Information</p>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Full Name *</label>
<input style={s.input} name="name" value={form.name} onChange={handleChange} required />
</div>
<div style={s.col}>
<label style={s.label}>Date of Birth</label>
<input style={s.input} type="date" name="dob" value={form.dob} onChange={handleChange} />
</div>
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Phone</label>
<input style={s.input} name="phone" value={form.phone} onChange={handleChange} />
</div>
<div style={s.col}>
<label style={s.label}>Email</label>
<input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} />
</div>
</div>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Address</label>
<input style={s.input} name="address" value={form.address} onChange={handleChange} />
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Household Size</label>
<input style={s.input} type="number" name="household_size" value={form.household_size} onChange={handleChange} />
</div>
<div style={s.col}>
<label style={s.label}>Smoker?</label>
<select style={s.select} name="smoker" value={form.smoker} onChange={handleChange}>
<option value={false}>No</option>
<option value={true}>Yes</option>
</select>
</div>
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Client Type</label>
<select style={s.select} name="client_type" value={form.client_type} onChange={handleChange}>
<option value="insurance">Insurance</option>
<option value="financial">Financial</option>
<option value="both">Both</option>
</select>
</div>
<div style={s.col}>
<label style={s.label}>Status</label>
<select style={s.select} name="status" value={form.status} onChange={handleChange}>
<option value="lead">Lead</option>
<option value="prospect">Prospect</option>
<option value="active">Active Client</option>
<option value="inactive">Inactive</option>
</select>
</div>
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Source</label>
<select style={s.select} name="source" value={form.source} onChange={handleChange}>
<option value="manual">Manual Entry</option>
<option value="referral">Referral</option>
<option value="web_form">Web Form</option>
<option value="imported">Imported</option>
</select>
</div>
<div style={s.col}>
<label style={s.label}>Last Contacted</label>
<input style={s.input} type="date" name="last_contacted" value={form.last_contacted} onChange={handleChange} />
</div>
</div>
</div>
)}

{activeTab === 'insurance' && (
<div>
<p style={s.sectionTitle}>Insurance Profile</p>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Current Carrier</label>
<input style={s.input} name="current_carrier" value={form.current_carrier} onChange={handleChange} />
</div>
<div style={s.col}>
<label style={s.label}>Coverage Type</label>
<select style={s.select} name="coverage_type" value={form.coverage_type} onChange={handleChange}>
<option value="">Select...</option>
<option value="individual">Individual</option>
<option value="family">Family</option>
<option value="small_group">Small Group</option>
<option value="medicare">Medicare</option>
</select>
</div>
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Plan Type</label>
<select style={s.select} name="plan_type" value={form.plan_type} onChange={handleChange}>
<option value="">Select...</option>
<option value="hmo">HMO</option>
<option value="ppo">PPO</option>
<option value="epo">EPO</option>
<option value="medicare_advantage">Medicare Advantage</option>
<option value="medigap">Medigap</option>
<option value="term_life">Term Life</option>
<option value="whole_life">Whole Life</option>
<option value="final_expense">Final Expense</option>
</select>
</div>
<div style={s.col}>
<label style={s.label}>Renewal Date</label>
<input style={s.input} type="date" name="renewal_date" value={form.renewal_date} onChange={handleChange} />
</div>
</div>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Interested Coverage</label>
<input style={s.input} name="interested_coverage" value={form.interested_coverage} onChange={handleChange} placeholder="e.g. Term Life, Medicare Advantage..." />
</div>
</div>
)}

{activeTab === 'financial' && (
<div>
<p style={s.sectionTitle}>Financial Profile</p>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Current Financial Products</label>
<input style={s.input} name="current_financial_products" value={form.current_financial_products} onChange={handleChange} placeholder="e.g. IRA, 401k, Annuity..." />
</div>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Interested Financial Products</label>
<input style={s.input} name="interested_financial_products" value={form.interested_financial_products} onChange={handleChange} placeholder="e.g. Annuity, Roth IRA..." />
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Retirement Goal Age</label>
<input style={s.input} type="number" name="retirement_goal_age" value={form.retirement_goal_age} onChange={handleChange} placeholder="e.g. 65" />
</div>
<div style={s.col}>
<label style={s.label}>Risk Tolerance</label>
<select style={s.select} name="risk_tolerance" value={form.risk_tolerance} onChange={handleChange}>
<option value="">Select...</option>
<option value="conservative">Conservative</option>
<option value="moderate">Moderate</option>
<option value="aggressive">Aggressive</option>
</select>
</div>
</div>
</div>
)}

{activeTab === 'notes' && (
<div>
<p style={s.sectionTitle}>Notes & Activity</p>
<label style={s.label}>Notes</label>
<textarea style={s.textarea} name="notes" value={form.notes} onChange={handleChange} placeholder="Add any notes about this client..." />
</div>
)}

</div>

<div style={s.footer}>
<span style={s.errorMsg}>{error}</span>
<div style={{ display: 'flex', gap: '10px' }}>
<button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
<button type="submit" style={s.saveBtn}>Save Client</button>
</div>
</div>
</form>
</div>
</div>
);
}

export default ClientForm;