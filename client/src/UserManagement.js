import React, { useState, useEffect } from 'react';

const API = 'https://policy-desk-production.up.railway.app';

function UserManagement({ onClose }) {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editUser, setEditUser] = useState(null);
const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');

const GREEN = '#2B5C2B';
const GOLD = '#C9A227';
const token = localStorage.getItem('token');

const s = {
overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
modal: { backgroundColor: 'white', borderRadius: '12px', width: '700px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
header: { backgroundColor: GREEN, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
body: { padding: '24px', overflowY: 'auto', flex: 1 },
footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
table: { width: '100%', borderCollapse: 'collapse' },
th: { backgroundColor: GREEN, color: 'white', padding: '10px 14px', textAlign: 'left', fontSize: '13px' },
td: { padding: '10px 14px', borderBottom: '1px solid #eee', fontSize: '14px' },
addBtn: { backgroundColor: GOLD, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
closeBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' },
saveBtn: { backgroundColor: GREEN, color: 'white', border: 'none', padding: '9px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
input: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' },
select: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' },
badge: (role) => ({ backgroundColor: role === 'admin' ? '#D4EDDA' : '#CCE5FF', color: role === 'admin' ? '#155724' : '#004085', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }),
activeBadge: (active) => ({ backgroundColor: active ? '#D4EDDA' : '#F8D7DA', color: active ? '#155724' : '#721C24', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }),
editBtn: { backgroundColor: 'transparent', border: '1px solid #ccc', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
deleteBtn: { backgroundColor: 'transparent', border: '1px solid #F5C6CB', color: '#721C24', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
formOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 },
formModal: { backgroundColor: 'white', borderRadius: '10px', padding: '28px', width: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
formTitle: { margin: '0 0 20px', color: GREEN },
errorMsg: { backgroundColor: '#F8D7DA', color: '#721C24', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '14px' },
};

useEffect(() => {
fetchUsers();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

async function fetchUsers() {
try {
const res = await fetch(`${API}/api/users`, {
headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
setUsers(Array.isArray(data) ? data : []);
setLoading(false);
} catch (err) {
setLoading(false);
}
}

async function handleSave(e) {
e.preventDefault();
setSaving(true);
setError('');
try {
const url = editUser ? `${API}/api/users/${editUser.id}` : `${API}/api/users`;
const method = editUser ? 'PUT' : 'POST';
const body = editUser
? { name: form.name, email: form.email, role: form.role, active: form.active }
: { name: form.name, email: form.email, password: form.password, role: form.role };

const res = await fetch(url, {
method,
headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
body: JSON.stringify(body),
});
const data = await res.json();
if (!res.ok) { setError(data.error || 'Failed to save'); setSaving(false); return; }
fetchUsers();
setShowForm(false);
setEditUser(null);
setForm({ name: '', email: '', password: '', role: 'employee' });
} catch (err) {
setError('Connection error');
}
setSaving(false);
}

async function handleDelete(user) {
if (window.confirm(`Delete ${user.name}? They will lose access immediately.`)) {
await fetch(`${API}/api/users/${user.id}`, {
method: 'DELETE',
headers: { Authorization: `Bearer ${token}` }
});
fetchUsers();
}
}

function handleEdit(user) {
setEditUser(user);
setForm({ name: user.name, email: user.email, password: '', role: user.role, active: user.active });
setShowForm(true);
}

function handleAdd() {
setEditUser(null);
setForm({ name: '', email: '', password: '', role: 'employee' });
setShowForm(true);
}

return (
<div style={s.overlay}>
<div style={s.modal}>
<div style={s.header}>
<h2 style={s.headerTitle}>👥 Manage Users</h2>
<button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
</div>

<div style={s.body}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
<p style={{ margin: 0, color: '#555', fontSize: '14px' }}>{users.length} user{users.length !== 1 ? 's' : ''} in the system</p>
<button style={s.addBtn} onClick={handleAdd}>+ Add User</button>
</div>

{loading ? (
<p>Loading users...</p>
) : users.length === 0 ? (
<p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No users found. Make sure you are logged in as Admin.</p>
) : (
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Name</th>
<th style={s.th}>Email</th>
<th style={s.th}>Role</th>
<th style={s.th}>Status</th>
<th style={s.th}>Actions</th>
</tr>
</thead>
<tbody>
{users.map(user => (
<tr key={user.id}>
<td style={{ ...s.td, fontWeight: '600' }}>{user.name}</td>
<td style={s.td}>{user.email}</td>
<td style={s.td}><span style={s.badge(user.role)}>{user.role}</span></td>
<td style={s.td}><span style={s.activeBadge(user.active)}>{user.active ? 'Active' : 'Inactive'}</span></td>
<td style={s.td}>
<button style={s.editBtn} onClick={() => handleEdit(user)}>Edit</button>
<button style={s.deleteBtn} onClick={() => handleDelete(user)}>Remove</button>
</td>
</tr>
))}
</tbody>
</table>
)}
</div>

<div style={s.footer}>
<button style={s.closeBtn} onClick={onClose}>Close</button>
</div>
</div>

{showForm && (
<div style={s.formOverlay}>
<div style={s.formModal}>
<h2 style={s.formTitle}>{editUser ? 'Edit User' : 'Add New User'}</h2>
{error && <div style={s.errorMsg}>{error}</div>}
<form onSubmit={handleSave}>
<label style={s.label}>Full Name *</label>
<input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
<label style={s.label}>Email Address *</label>
<input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
{!editUser && <>
<label style={s.label}>Temporary Password *</label>
<input style={s.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="They can change this after login" />
</>}
<label style={s.label}>Role *</label>
<select style={s.select} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
<option value="employee">Employee</option>
<option value="admin">Admin</option>
</select>
{editUser && <>
<label style={s.label}>Status</label>
<select style={s.select} value={form.active} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}>
<option value="true">Active</option>
<option value="false">Inactive</option>
</select>
</>}
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
<button type="button" style={s.closeBtn} onClick={() => setShowForm(false)}>Cancel</button>
<button type="submit" style={s.saveBtn} disabled={saving}>{saving ? 'Saving...' : editUser ? 'Save Changes' : 'Create User'}</button>
</div>
</form>
</div>
</div>
)}
</div>
);
}

export default UserManagement;