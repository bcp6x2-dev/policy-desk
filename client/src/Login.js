import React, { useState } from 'react';

function Login({ onLogin }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

async function handleSubmit(e) {
e.preventDefault();
setLoading(true);
setError('');

try {
const res = await fetch('http://localhost:5000/api/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password }),
});

const data = await res.json();

if (!res.ok) {
setError(data.error || 'Login failed');
setLoading(false);
return;
}

localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
onLogin(data.user);

} catch (err) {
setError('Unable to connect to server');
setLoading(false);
}
}

return (
<div style={{
minHeight: '100vh', backgroundColor: '#F4F6F9',
display: 'flex', alignItems: 'center', justifyContent: 'center'
}}>
<div style={{
backgroundColor: 'white', borderRadius: '12px',
boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '40px', width: '400px'
}}>
<div style={{ textAlign: 'center', marginBottom: '32px' }}>
<h1 style={{ color: '#1B4F8A', margin: '0 0 8px', fontSize: '26px' }}>PolicyDesk CRM</h1>
<p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Comprehensive Health Solutions</p>
</div>

{error && (
<div style={{
backgroundColor: '#F8D7DA', color: '#721C24',
padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px'
}}>
{error}
</div>
)}

<form onSubmit={handleSubmit}>
<div style={{ marginBottom: '16px' }}>
<label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
Email Address
</label>
<input
type="email"
value={email}
onChange={e => setEmail(e.target.value)}
required
style={{
width: '100%', padding: '10px 12px', borderRadius: '6px',
border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
}}
placeholder="you@example.com"
/>
</div>

<div style={{ marginBottom: '24px' }}>
<label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
Password
</label>
<input
type="password"
value={password}
onChange={e => setPassword(e.target.value)}
required
style={{
width: '100%', padding: '10px 12px', borderRadius: '6px',
border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
}}
placeholder="Enter your password"
/>
</div>

<button
type="submit"
disabled={loading}
style={{
width: '100%', padding: '12px', backgroundColor: '#1B4F8A',
color: 'white', border: 'none', borderRadius: '6px',
fontSize: '15px', fontWeight: '600', cursor: 'pointer'
}}
>
{loading ? 'Signing in...' : 'Sign In'}
</button>
</form>
</div>
</div>
);
}

export default Login;