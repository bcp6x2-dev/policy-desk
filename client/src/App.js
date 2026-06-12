import React, { useState, useEffect } from 'react';
import Login from './Login';
import ClientForm from './ClientForm';
import ClientDetail from './ClientDetail';
import ImportTool from './ImportTool';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';

function App() {
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
const [contacts, setContacts] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [showClientForm, setShowClientForm] = useState(false);
const [selectedContact, setSelectedContact] = useState(null);
const [filterType, setFilterType] = useState('all');
const [filterStatus, setFilterStatus] = useState('all');
const [showImport, setShowImport] = useState(false);
const [showDashboard, setShowDashboard] = useState(false);
const [showUsers, setShowUsers] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const contactsPerPage = 25;

useEffect(() => {
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');
if (savedUser) setUser(JSON.parse(savedUser));
if (savedToken) setToken(savedToken);
setLoading(false);
}, []);

useEffect(() => {
if (user) fetchContacts();
}, [user]);

useEffect(() => {
setCurrentPage(1);
}, [search, filterType, filterStatus]);

function handleLogin(loggedInUser) {
setUser(loggedInUser);
const t = localStorage.getItem('token');
setToken(t);
}

function handleLogout() {
localStorage.removeItem('token');
localStorage.removeItem('user');
setUser(null);
setToken(null);
setContacts([]);
}

function fetchContacts() {
fetch('https://policy-desk-production.up.railway.app/api/contacts')
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

const totalPages = Math.ceil(filtered.length / contactsPerPage);
const paginated = filtered.slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage);

const RED = '#851D21';
const BLACK = '#303030';
const CREAM = '#E6D6C6';

const styles = {
app: { fontFamily: 'Arial', backgroundColor: '#F4F6F9', minHeight: '100vh' },
header: { backgroundColor: BLACK, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `4px solid ${RED}` },
body: { padding: '24px 32px' },
toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
search: { padding: '8px 14px', borderRadius: '6px', border: '1px solid #ccc', width: '280px', fontSize: '14px' },
addBtn: { backgroundColor: RED, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
exportBtn: { backgroundColor: BLACK, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
importBtn: { backgroundColor: RED, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
dashBtn: { backgroundColor: RED, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
usersBtn: { backgroundColor: 'transparent', border: `1px solid ${CREAM}`, color: CREAM, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
card: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', overflow: 'hidden' },
table: { width: '100%', borderCollapse: 'collapse' },
th: { backgroundColor: BLACK, color: 'white', padding: '12px 16px', textAlign: 'left', fontSize: '13px' },
td: { padding: '12px 16px', borderBottom: '1px solid #F0F0F0', fontSize: '14px' },
badge: (status) => ({
backgroundColor: status === 'lead' ? '#FFF3CD' : status === 'active' ? '#D4EDDA' : status === 'prospect' ? '#CCE5FF' : '#F8D7DA',
color: status === 'lead' ? '#856404' : status === 'active' ? '#155724' : status === 'prospect' ? '#004085' : '#721C24',
padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
}),
filterBtn: (active, color) => ({
padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px',
fontWeight: active ? '700' : '400', backgroundColor: active ? color : 'white',
color: active ? 'white' : '#555', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}),
};

if (!user) return <Login onLogin={handleLogin} />;

return (
<div style={styles.app}>
<div style={styles.header}>
<span style={{ color: CREAM, fontWeight: 'bold', fontSize: '20px' }}>Financial Consulting Network, LLC</span>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
<span style={{ color: CREAM, fontSize: '14px' }}>Welcome, {user.name}</span>
<button onClick={() => setShowDashboard(true)} style={styles.dashBtn}>📊 Dashboard</button>
{user.role === 'admin' && (
<button onClick={() => setShowUsers(true)} style={styles.usersBtn}>👥 Manage Users</button>
)}
<button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: `1px solid ${CREAM}`, color: CREAM, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
Sign Out
</button>
</div>
</div>

<div style={styles.body}>
<div style={styles.toolbar}>
<div>
<h2 style={{ margin: 0, color: BLACK }}>Contacts ({filtered.length})</h2>
<p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>{contacts.length} total records</p>
</div>
<div style={{ display: 'flex', gap: '12px' }}>
<input style={styles.search} placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
<button style={styles.importBtn} onClick={() => setShowImport(true)}>📥 Import Excel</button>
<button onClick={() => { const url = `https://policy-desk-production.up.railway.app/api/contacts/export?type=${filterType}&status=${filterStatus}`; window.open(url, '_blank'); }} style={styles.exportBtn}>⬇ Export CSV</button>
<button style={styles.addBtn} onClick={() => setShowClientForm(true)}>+ Add Client</button>
</div>
</div>

<div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
{[
{ key: 'all', label: '👥 All Clients', color: BLACK },
{ key: 'insurance', label: '🏥 Insurance', color: RED },
{ key: 'financial', label: '💰 Financial', color: '#6f42c1' },
{ key: 'both', label: '⭐ Both', color: '#0d6efd' },
].map(({ key, label, color }) => (
<button key={key} onClick={() => setFilterType(key)} style={styles.filterBtn(filterType === key, color)}>{label}</button>
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
<button key={key} onClick={() => setFilterStatus(key)} style={styles.filterBtn(filterStatus === key, color)}>{label}</button>
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
{paginated.length === 0 ? (
<tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#888' }}>No contacts found</td></tr>
) : (
paginated.map(contact => (
<tr key={contact.id} onClick={() => setSelectedContact(contact)} style={{ cursor: 'pointer' }}
onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FDF5F5'}
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

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
<span style={{ color: '#888', fontSize: '13px' }}>
Showing {filtered.length === 0 ? 0 : ((currentPage - 1) * contactsPerPage) + 1} - {Math.min(currentPage * contactsPerPage, filtered.length)} of {filtered.length} contacts
</span>
<div style={{ display: 'flex', gap: '8px' }}>
<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #ccc', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: 'white' }}>
← Previous
</button>
<span style={{ padding: '6px 14px', fontSize: '14px', color: '#555' }}>Page {currentPage} of {totalPages}</span>
<button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #ccc', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: 'white' }}>
Next →
</button>
</div>
</div>
</div>

{showClientForm && <ClientForm onSave={() => fetchContacts()} onClose={() => setShowClientForm(false)} />}

{selectedContact && (
<ClientDetail
contact={selectedContact}
onClose={() => setSelectedContact(null)}
onSave={() => { fetchContacts(); setSelectedContact(null); }}
/>
)}

{showImport && <ImportTool onClose={() => setShowImport(false)} onImported={() => fetchContacts()} />}

{showDashboard && <Dashboard contacts={contacts} onClose={() => setShowDashboard(false)} />}

{showUsers && <UserManagement token={token} onClose={() => setShowUsers(false)} />}
</div>
);
}

export default App;