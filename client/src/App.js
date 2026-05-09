import React, { useState, useEffect } from 'react';
import Login from './Login';

function App() {
const [user, setUser] = useState(null);
const [contacts, setContacts] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [showForm, setShowForm] = useState(false);
const [newContact, setNewContact] = useState({
name: '', email: '', phone: '', address: '', dob: '', status: 'lead', source: 'manual'
});

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

function handleAddContact(e) {
e.preventDefault();
fetch('http://localhost:5000/api/contacts', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(newContact),
})
.then(res => res.json())
.then(() => {
fetchContacts();
setShowForm(false);
setNewContact({ name: '', email: '', phone: '', address: '', dob: '', status: 'lead', source: 'manual' });
});
}

const filtered = contacts.filter(c =>
c.name?.toLowerCase().includes(search.toLowerCase()) ||
c.email?.toLowerCase().includes(search.toLowerCase()) ||
c.phone?.includes(search)
);

const styles = {
app: { fontFamily: 'Arial', backgroundColor: '#F4F6F9', minHeight: '100vh' },
header: { backgroundColor: '#1B4F8A', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
headerTitle: { color: 'white', margin: 0, fontSize: '22px', fontWeight: 'bold' },
body: { padding: '24px 32px' },
toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
search: { padding: '8px 14px', borderRadius: '6px', border: '1px solid #ccc', width: '280px', fontSize: '14px' },
addBtn: { backgroundColor: '#1B4F8A', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
card: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' },
table: { width: '100%', borderCollapse: 'collapse' },
th: { backgroundColor: '#1B4F8A', color: 'white', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
td: { padding: '12px 16px', borderBottom: '1px solid #F0F0F0', fontSize: '14px' },
badge: (status) => ({
backgroundColor: status === 'lead' ? '#FFF3CD' : status === 'active' ? '#D4EDDA' : '#F8D7DA',
color: status === 'lead' ? '#856404' : status === 'active' ? '#155724' : '#721C24',
padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
}),
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: 'white', borderRadius: '10px', padding: '28px', width: '460px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
modalTitle: { margin: '0 0 20px', color: '#1B4F8A' },
input: { width: '100%', padding: '9px 12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' },
select: { width: '100%', padding: '9px 12px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' },
modalBtns: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
cancelBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px' },
saveBtn: { backgroundColor: '#1B4F8A', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
};

if (!user) return <Login onLogin={handleLogin} />;

return (
<div style={styles.app}>
<div style={styles.header}>
<h1 style={styles.headerTitle}>PolicyDesk CRM</h1>
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
<span style={{ color: '#BDD5F5', fontSize: '14px' }}>Welcome, {user.name}</span>
<button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid #BDD5F5', color: '#BDD5F5', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
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
<button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Add Contact</button>
</div>
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
<th style={styles.th}>Status</th>
<th style={styles.th}>Source</th>
</tr>
</thead>
<tbody>
{filtered.length === 0 ? (
<tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#888' }}>No contacts found</td></tr>
) : (
filtered.map(contact => (
<tr key={contact.id}
onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFF'}
onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
<td style={{ ...styles.td, fontWeight: '600' }}>{contact.name}</td>
<td style={styles.td}>{contact.email}</td>
<td style={styles.td}>{contact.phone}</td>
<td style={styles.td}><span style={styles.badge(contact.status)}>{contact.status}</span></td>
<td style={styles.td}>{contact.source}</td>
</tr>
))
)}
</tbody>
</table>
)}
</div>
</div>

{showForm && (
<div style={styles.overlay}>
<div style={styles.modal}>
<h2 style={styles.modalTitle}>Add New Contact</h2>
<form onSubmit={handleAddContact}>
<input style={styles.input} placeholder="Full Name *" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} required />
<input style={styles.input} placeholder="Email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} />
<input style={styles.input} placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
<input style={styles.input} placeholder="Address" value={newContact.address} onChange={e => setNewContact({ ...newContact, address: e.target.value })} />
<input style={styles.input} type="date" value={newContact.dob} onChange={e => setNewContact({ ...newContact, dob: e.target.value })} />
<select style={styles.select} value={newContact.status} onChange={e => setNewContact({ ...newContact, status: e.target.value })}>
<option value="lead">Lead</option>
<option value="prospect">Prospect</option>
<option value="active">Active Client</option>
<option value="inactive">Inactive</option>
</select>
<div style={styles.modalBtns}>
<button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
<button type="submit" style={styles.saveBtn}>Save Contact</button>
</div>
</form>
</div>
</div>
)}
</div>
);
}

export default App;