import React, { useState } from 'react';

function ClientDetail({ contact, onClose, onSave }) {
const [form, setForm] = useState({ ...contact });
const [activeTab, setActiveTab] = useState('demographics');
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);

function handleChange(e) {
const { name, value } = e.target;
setForm({ ...form, [name]: value });
}

async function handleSave() {
setSaving(true);
try {
const res = await fetch(`http://localhost:5000/api/contacts/${form.id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(form),
});
const data = await res.json();
onSave(data);
setSaved(true);
setTimeout(() => setSaved(false), 2000);
} catch (err) {
console.error(err);
}
setSaving(false);
}

const s = {
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: 'white', borderRadius: '12px', width: '680px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
header: { backgroundColor: '#1B4F8A', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
headerSub: { color: '#BDD5F5', fontSize: '13px', marginTop: '4px' },
tabs: { display: 'flex', borderBottom: '2px solid #E0E0E0', backgroundColor: '#F8F9FA' },
tab: (active) => ({ padding: '12px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: active ? '700' : '400', color: active ? '#1B4F8A' : '#666', borderBottom: active ? '2px solid #1B4F8A' : 'none', backgroundColor: 'transparent', border: 'none', marginBottom: '-2px' }),
body: { padding: '24px', overflowY: 'auto', flex: 1, maxHeight: '60vh' },
row: { display: 'flex', gap: '12px', marginBottom: '12px' },
col: { flex: 1 },
label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
input: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
select: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
textarea: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' },
sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#1B4F8A', textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #E8F0FA' },
footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
closeBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' },
saveBtn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: saving ? '#888' : '#1B4F8A', color: 'white', fontWeight: '600' },
savedMsg: { color: '#155724', fontSize: '13px', fontWeight: '600' },
};

return (
<div style={s.overlay}>
<div style={s.modal}>
<div style={s.header}>
<div>
<h2 style={s.headerTitle}>{form.name}</h2>
<p style={s.headerSub}>{form.client_type === 'both' ? 'Financial & Insurance Client' : form.client_type === 'financial' ? 'Financial Client' : 'Insurance Client'} · {form.status}</p>
</div>
<button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
</div>

<div style={s.tabs}>
{['demographics', 'insurance', 'financial', 'notes'].map(tab => (
<button key={tab} style={s.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
{tab === 'demographics' ? '👤 Demographics' : tab === 'insurance' ? '🏥 Insurance' : tab === 'financial' ? '💰 Financial' : '📝 Notes'}
</button>
))}
</div>

<div style={s.body}>
{activeTab === 'demographics' && (
<div>
<p style={s.sectionTitle}>Basic Information</p>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Full Name</label>
<input style={s.input} name="name" value={form.name || ''} onChange={handleChange} />
</div>
<div style={s.col}>
<label style={s.label}>Date of Birth</label>
<input style={s.input} type="date" name="dob" value={form.dob ? form.dob.split('T')[0] : ''} onChange={handleChange} />
</div>
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Phone</label>
<input style={s.input} name="phone" value={form.phone || ''} onChange={handleChange} />
</div>
<div style={s.col}>
<label style={s.label}>Email</label>
<input style={s.input} name="email" value={form.email || ''} onChange={handleChange} />
</div>
</div>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Address</label>
<input style={s.input} name="address" value={form.address || ''} onChange={handleChange} />
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Household Size</label>
<input style={s.input} type="number" name="household_size" value={form.household_size || ''} onChange={handleChange} />
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
<select style={s.select} name="client_type" value={form.client_type || 'insurance'} onChange={handleChange}>
<option value="insurance">Insurance</option>
<option value="financial">Financial</option>
<option value="both">Both</option>
</select>
</div>
<div style={s.col}>
<label style={s.label}>Status</label>
<select style={s.select} name="status" value={form.status || 'lead'} onChange={handleChange}>
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
<select style={s.select} name="source" value={form.source || 'manual'} onChange={handleChange}>
<option value="manual">Manual Entry</option>
<option value="referral">Referral</option>
<option value="web_form">Web Form</option>
<option value="imported">Imported</option>
</select>
</div>
<div style={s.col}>
<label style={s.label}>Last Contacted</label>
<input style={s.input} type="date" name="last_contacted" value={form.last_contacted ? form.last_contacted.split('T')[0] : ''} onChange={handleChange} />
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
<input style={s.input} name="current_carrier" value={form.current_carrier || ''} onChange={handleChange} />
</div>
<div style={s.col}>
<label style={s.label}>Coverage Type</label>
<select style={s.select} name="coverage_type" value={form.coverage_type || ''} onChange={handleChange}>
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
<select style={s.select} name="plan_type" value={form.plan_type || ''} onChange={handleChange}>
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
<input style={s.input} type="date" name="renewal_date" value={form.renewal_date ? form.renewal_date.split('T')[0] : ''} onChange={handleChange} />
</div>
</div>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Interested Coverage</label>
<input style={s.input} name="interested_coverage" value={form.interested_coverage || ''} onChange={handleChange} placeholder="e.g. Term Life, Medicare Advantage..." />
</div>
</div>
)}

{activeTab === 'financial' && (
<div>
<p style={s.sectionTitle}>Financial Profile</p>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Current Financial Products</label>
<input style={s.input} name="current_financial_products" value={form.current_financial_products || ''} onChange={handleChange} placeholder="e.g. IRA, 401k, Annuity..." />
</div>
<div style={{ marginBottom: '12px' }}>
<label style={s.label}>Interested Financial Products</label>
<input style={s.input} name="interested_financial_products" value={form.interested_financial_products || ''} onChange={handleChange} placeholder="e.g. Annuity, Roth IRA..." />
</div>
<div style={s.row}>
<div style={s.col}>
<label style={s.label}>Retirement Goal Age</label>
<input style={s.input} type="number" name="retirement_goal_age" value={form.retirement_goal_age || ''} onChange={handleChange} placeholder="e.g. 65" />
</div>
<div style={s.col}>
<label style={s.label}>Risk Tolerance</label>
<select style={s.select} name="risk_tolerance" value={form.risk_tolerance || ''} onChange={handleChange}>
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
<textarea style={s.textarea} name="notes" value={form.notes || ''} onChange={handleChange} placeholder="Add notes about this client..." />
</div>
)}
</div>

<div style={s.footer}>
<button style={s.closeBtn} onClick={onClose}>Close</button>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
{saved && <span style={s.savedMsg}>✓ Saved successfully!</span>}
<button style={s.saveBtn} onClick={handleSave} disabled={saving}>
{saving ? 'Saving...' : 'Save Changes'}
</button>
</div>
</div>
</div>
</div>
);
}

export default ClientDetail;