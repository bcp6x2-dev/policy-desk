import React from 'react';

function Dashboard({ contacts, onClose }) {
const GREEN = '#2B5C2B';
const GOLD = '#C9A227';

// Calculate stats
const total = contacts.length;
const insurance = contacts.filter(c => c.client_type === 'insurance').length;
const financial = contacts.filter(c => c.client_type === 'financial').length;
const both = contacts.filter(c => c.client_type === 'both').length;

const leads = contacts.filter(c => c.status === 'lead').length;
const prospects = contacts.filter(c => c.status === 'prospect').length;
const active = contacts.filter(c => c.status === 'active').length;
const inactive = contacts.filter(c => c.status === 'inactive').length;

const crossSellOpportunities = contacts.filter(c => c.client_type === 'insurance').length;
const financialOpportunities = contacts.filter(c => c.client_type === 'financial').length;

const s = {
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: '#F4F6F9', borderRadius: '12px', width: '800px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
header: { backgroundColor: GREEN, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
headerTitle: { color: 'white', margin: 0, fontSize: '20px', fontWeight: 'bold' },
body: { padding: '24px', overflowY: 'auto' },
sectionTitle: { fontSize: '14px', fontWeight: '700', color: '#555', textTransform: 'uppercase', marginBottom: '12px', marginTop: '24px' },
grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '8px' },
grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '8px' },
card: (color) => ({
backgroundColor: 'white',
borderRadius: '10px',
padding: '20px',
boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
borderTop: `4px solid ${color}`,
}),
cardNumber: { fontSize: '36px', fontWeight: 'bold', margin: '4px 0' },
cardLabel: { fontSize: '13px', color: '#888' },
cardPercent: (color) => ({ fontSize: '12px', color, fontWeight: '600', marginTop: '4px' }),
closeBtn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: GOLD, color: 'white', fontWeight: '600' },
footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white' },
opportunityCard: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
opportunityNumber: { fontSize: '28px', fontWeight: 'bold', color: GREEN },
bar: (value, total, color) => ({
height: '8px',
borderRadius: '4px',
backgroundColor: color,
width: total > 0 ? `${(value / total) * 100}%` : '0%',
marginTop: '6px',
}),
barBg: { height: '8px', borderRadius: '4px', backgroundColor: '#eee', marginTop: '6px' },
};

function pct(val) {
return total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';
}

return (
<div style={s.overlay}>
<div style={s.modal}>
<div style={s.header}>
<h2 style={s.headerTitle}>📊 Admin Dashboard</h2>
<button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
</div>

<div style={s.body}>

{/* Total */}
<p style={s.sectionTitle}>Overview</p>
<div style={{ ...s.card(GREEN), marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<div>
<div style={s.cardLabel}>Total Contacts</div>
<div style={{ ...s.cardNumber, color: GREEN }}>{total.toLocaleString()}</div>
</div>
<div style={{ fontSize: '48px' }}>👥</div>
</div>

{/* By Type */}
<p style={s.sectionTitle}>By Client Type</p>
<div style={s.grid}>
<div style={s.card('#0d6efd')}>
<div style={s.cardLabel}>Insurance Only</div>
<div style={{ ...s.cardNumber, color: '#0d6efd' }}>{insurance.toLocaleString()}</div>
<div style={s.cardPercent('#0d6efd')}>{pct(insurance)} of total</div>
<div style={s.barBg}><div style={s.bar(insurance, total, '#0d6efd')} /></div>
</div>
<div style={s.card('#198754')}>
<div style={s.cardLabel}>Financial Only</div>
<div style={{ ...s.cardNumber, color: '#198754' }}>{financial.toLocaleString()}</div>
<div style={s.cardPercent('#198754')}>{pct(financial)} of total</div>
<div style={s.barBg}><div style={s.bar(financial, total, '#198754')} /></div>
</div>
<div style={s.card('#6f42c1')}>
<div style={s.cardLabel}>Both Verticals</div>
<div style={{ ...s.cardNumber, color: '#6f42c1' }}>{both.toLocaleString()}</div>
<div style={s.cardPercent('#6f42c1')}>{pct(both)} of total</div>
<div style={s.barBg}><div style={s.bar(both, total, '#6f42c1')} /></div>
</div>
<div style={s.card(GOLD)}>
<div style={s.cardLabel}>Untagged</div>
<div style={{ ...s.cardNumber, color: GOLD }}>{(total - insurance - financial - both).toLocaleString()}</div>
<div style={s.cardPercent(GOLD)}>{pct(total - insurance - financial - both)} of total</div>
<div style={s.barBg}><div style={s.bar(total - insurance - financial - both, total, GOLD)} /></div>
</div>
</div>

{/* By Status */}
<p style={s.sectionTitle}>By Status</p>
<div style={s.grid}>
<div style={s.card('#856404')}>
<div style={s.cardLabel}>Leads</div>
<div style={{ ...s.cardNumber, color: '#856404' }}>{leads.toLocaleString()}</div>
<div style={s.cardPercent('#856404')}>{pct(leads)} of total</div>
<div style={s.barBg}><div style={s.bar(leads, total, '#856404')} /></div>
</div>
<div style={s.card('#004085')}>
<div style={s.cardLabel}>Prospects</div>
<div style={{ ...s.cardNumber, color: '#004085' }}>{prospects.toLocaleString()}</div>
<div style={s.cardPercent('#004085')}>{pct(prospects)} of total</div>
<div style={s.barBg}><div style={s.bar(prospects, total, '#004085')} /></div>
</div>
<div style={s.card('#155724')}>
<div style={s.cardLabel}>Active Clients</div>
<div style={{ ...s.cardNumber, color: '#155724' }}>{active.toLocaleString()}</div>
<div style={s.cardPercent('#155724')}>{pct(active)} of total</div>
<div style={s.barBg}><div style={s.bar(active, total, '#155724')} /></div>
</div>
<div style={s.card('#721C24')}>
<div style={s.cardLabel}>Inactive</div>
<div style={{ ...s.cardNumber, color: '#721C24' }}>{inactive.toLocaleString()}</div>
<div style={s.cardPercent('#721C24')}>{pct(inactive)} of total</div>
<div style={s.barBg}><div style={s.bar(inactive, total, '#721C24')} /></div>
</div>
</div>

{/* Cross-sell */}
<p style={s.sectionTitle}>Cross-Sell Opportunities</p>
<div style={s.grid2}>
<div style={s.opportunityCard}>
<div>
<div style={s.cardLabel}>Insurance clients without Financial products</div>
<div style={s.opportunityNumber}>{crossSellOpportunities.toLocaleString()}</div>
<div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Potential financial product upsell</div>
</div>
<div style={{ fontSize: '36px' }}>💰</div>
</div>
<div style={s.opportunityCard}>
<div>
<div style={s.cardLabel}>Financial clients without Insurance products</div>
<div style={s.opportunityNumber}>{financialOpportunities.toLocaleString()}</div>
<div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Potential insurance upsell</div>
</div>
<div style={{ fontSize: '36px' }}>🏥</div>
</div>
</div>

</div>

<div style={s.footer}>
<button
style={{ ...s.closeBtn, backgroundColor: '#F8D7DA', color: '#721C24', border: '1px solid #F5C6CB', marginRight: 'auto' }}
onClick={async () => {
if (window.confirm(`Are you sure you want to DELETE ALL ${total} contacts? This cannot be undone.`)) {
await fetch('https://policy-desk-production.up.railway.app/api/contacts', {
method: 'DELETE'
});
onClose();
window.location.reload();
}
}}
>
🗑 Delete All Contacts
</button>
<button style={s.closeBtn} onClick={onClose}>Close Dashboard</button>
</div>
</div>
</div>
);
}

export default Dashboard;