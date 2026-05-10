import React, { useState, useEffect } from 'react';
import Login from './Login';
import ClientForm from './ClientForm';
import ClientDetail from './ClientDetail';

function App() {
const [user, setUser] = useState(null);
const [contacts, setContacts] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [showClientForm, setShowClientForm] = useState(false);
const [selectedContact, setSelectedContact] = useState(null);
const [filterType, setFilterType] = useState('all');
const [filterStatus, setFilterStatus] = useState('all');

useEffect(() => {
const savedUser = localStorage.getItem('user');
if (savedUser) setUser(JSON.parse(savedUser));
else setLoading(false);
}, []);

useEffect(() => {
if (user) fetchContacts();
}, [user]);

function handleLogin(loggedInUser) {
setUser(loggedInUser);
}

function handleLogout() {
localStorage.removeItem('token');
localStorage.removeItem('user');
setUser(null);
setContacts([]);
}

function fetchContacts() {
fetch('http://localhost:5000/api/contacts')
.then(res => res.json())
.then(data => {
setContacts(data);
setLoading(false);
});
}

const filtered = contacts.filter(c => {
const matchesSearch =
c.name?.toLowerCase().includes(search.toLowerCase()) ||
c.email?.toLowerCase().includes(search.toLowerCase()) ||
c.phone?.includes(search);
const matchesType = filterType === 'all' || c.client_type === filterType;
const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
return matchesSearch && matchesType && matchesStatus;
});

const GREEN = '#2B5C2B';
const GOLD = '#C9A227';

const styles = {
app: { fontFamily: 'Arial', backgroundColor: '#F4F6F9', minHeight: '100vh' },
header: { backgroundColor: GREEN, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
body: { padding: '24px 32px' },
toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
search: { padding: '8px 14px', borderRadius: '6px', border: '1px solid #ccc', width: '280px', fontSize: '14px' },
addBtn: { backgroundColor: GOLD, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
exportBtn: { backgroundColor: GREEN, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
card: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' },
table: { width: '100%', borderCollapse: 'collapse' },
th: { backgroundColor: GREEN, color: 'white', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
td: { padding: '12px 16px', borderBottom: '1px solid #F0F0F0', fontSize: '14px' },
badge: (status) => ({
backgroundColor: status === 'lead' ? '#FFF3CD' : status === 'active' ? '#D4EDDA' : status === 'prospect' ? '#CCE5FF' : '#F8D7DA',
color: status === 'lead' ? '#856404' : status === 'active' ? '#155724' : status === 'prospect' ? '#004085' : '#721C24',
padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
}),
filterBtn: (active, color) => ({
padding: '6px 14px',
borderRadius: '20px',
border: 'none',
cursor: 'pointer',
fontSize: '12px',
fontWeight: active ? '700' : '400',
backgroundColor: active ? color : 'white',
color: active ? 'white' : '#555',
boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}),
};

if (!user) return <Login onLogin={handleLogin} />;

return (
<div style={styles.app}>
<div style={styles.header}>
<img src="/logo.png" alt="Comprehensive Health Solutions" style={{ height: '55px', objectFit: 'contain' }} />
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
<span style={{ color: '#E8D5A3', fontSize: '14px' }}>Welcome, {user.name}</span>
<button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid #C9A227', color: '#C9A227', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
Sign Out
</button>
</div>
</div>

<div style={styles.body}>
<div style={styles.toolbar}>
<div>
<h2 style={{ margin: 0 }}>Contacts ({filtered.length})</h2>
<p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>{contacts.length} total records</p>
</div>
<div style={{ display: 'flex', gap: '12px' }}>
<input style={styles.search} placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
<button
onClick={() => {
const url = `http://localhost:5000/api/contacts/export?type=${filterType}&status=${filterStatus}`;
window.open(url, '_blank');
}}
style={styles.exportBtn}
>
⬇ Export CSV
</button>
<button style={styles.addBtn} onClick={() => setShowClientForm(true)}>+ Add Client</button>
</div>
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
{[
{ key: 'all', label: '👥 All Clients', color: GREEN },
{ key: 'insurance', label: '🏥 Insurance', color: '#0d6efd' },
{ key: 'financial', label: '💰 Financial', color: '#198754' },
{ key: 'both', label: '⭐ Both', color: '#6f42c1' },
].map(({ key, label, color }) => (
<button key={key} onClick={() => setFilterType(key)} style={styles.filterBtn(filterType === key, color)}>
{label}
</button>
))}
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
{[
{ key: 'all', label: 'All Status', color: '#555' },
{ key: 'lead', label: '🟡 Lead', color: '#856404' },
{ key: 'prospect', label: '🔵 Prospect', color: '#004085' },
{ key: 'active', label: '🟢 Active', color: '#155724' },
{ key: 'inactive', label: '🔴 Inactive', color: '#721C24' },
].map(({ key, label, color }) => (
<button key={key} onClick={() => setFilterStatus(key)} style={styles.filterBtn(filterStatus === key, color)}>
{label}
</button>
))}
</div>

<div style={styles.card}>
{loading ? (
<p style={{ padding: '20px' }}>Loading contacts...</p>
) : (
<table style={styles.table}>
<thead>
<tr>
<th style={styles.th}>Name</th>
<th style={styles.th}>Email</th>
<th style={styles.th}>Phone</th>
<th style={styles.th}>Type</th>
<th style={styles.th}>Status</th>
</tr>
</thead>
<tbody>
{filtered.length === 0 ? (
<tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#888' }}>No contacts found</td></tr>
) : (
filtered.map(contact => (
<tr key={contact.id}
onClick={() => setSelectedContact(contact)}
style={{ cursor: 'pointer' }}
onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAF8'}
onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
<td style={{ ...styles.td, fontWeight: '600' }}>{contact.name}</td>
<td style={styles.td}>{contact.email}</td>
<td style={styles.td}>{contact.phone}</td>
<td style={styles.td}>{contact.client_type || 'insurance'}</td>
<td style={styles.td}><span style={styles.badge(contact.status)}>{contact.status}</span></td>
</tr>
))
)}
</tbody>
</table>
)}
</div>
</div>

{showClientForm && (
<ClientForm
onSave={() => fetchContacts()}
onClose={() => setShowClientForm(false)}
/>
)}

{selectedContact && (
<ClientDetail
contact={selectedContact}
onClose={() => setSelectedContact(null)}
onSave={() => { fetchContacts(); setSelectedContact(null); }}
/>
)}
</div>
);
}

export default App;