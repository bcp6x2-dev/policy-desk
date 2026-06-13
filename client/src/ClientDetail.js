import React, { useState, useEffect } from 'react';

function ClientDetail({ contact, onClose, onSave }) {
  const [form, setForm] = useState({ ...contact });
  const [activeTab, setActiveTab] = useState('demographics');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteBody, setNoteBody] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  const RED = '#851D21';
  const BLACK = '#303030';
  const CREAM = '#E6D6C6';

  const isMarried = form.is_married === true || form.is_married === 'true';

  useEffect(() => {
    if (contact.id) {
      fetch(`https://policy-desk-production.up.railway.app/api/notes/${contact.id}`)
        .then(res => res.json())
        .then(data => setNotesList(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    }
  }, [contact.id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === 'client_types') {
      const current = form.client_types ? form.client_types.split(',').map(s => s.trim()).filter(Boolean) : [];
      const updated = checked ? [...current, value] : current.filter(t => t !== value);
      setForm({ ...form, client_types: updated.join(',') });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  }

  function getClientTypes() {
    if (!form.client_types) return [];
    return form.client_types.split(',').map(s => s.trim()).filter(Boolean);
  }

  function formatNoteDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  async function handleSaveNote() {
    if (!noteBody.trim()) return;
    setNoteSaving(true);
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const broker_name = user ? user.name : 'Unknown';
      const res = await fetch(`https://policy-desk-production.up.railway.app/api/notes/${contact.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ body: noteBody, broker_name }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotesList([newNote, ...notesList]);
        setNoteBody('');
        setShowNoteModal(false);
      }
    } catch (err) {
      console.error(err);
    }
    setNoteSaving(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://policy-desk-production.up.railway.app/api/contacts/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      const planDate = form.financial_plan_start_date
        ? (typeof form.financial_plan_start_date === 'string'
            ? form.financial_plan_start_date.split('T')[0]
            : form.financial_plan_start_date)
        : null;

      if (planDate) {
        const userRaw = localStorage.getItem('user');
        const user = userRaw ? JSON.parse(userRaw) : null;
        await fetch('https://policy-desk-production.up.railway.app/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            contact_id: form.id,
            broker_name: user ? user.name : form.assigned_to,
            plan_start_date: planDate,
          }),
        });
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  // eslint-disable-next-line no-unused-vars
  const specialties = ['Cardiology','Dermatology','Endocrinology','Family Medicine','Gastroenterology','General Surgery','Geriatrics','Hematology','Internal Medicine','Nephrology','Neurology','Obstetrics & Gynecology','Oncology','Ophthalmology','Orthopedics','Otolaryngology (ENT)','Pediatrics','Psychiatry','Pulmonology','Radiology','Rheumatology','Urology','Other'];
  const healthCarriers = ['Aetna','Anthem','Cigna','Devoted','Essence','Humana','United Health'];
  const healthPlanTypes = ['HMO','PPO','EPO','Medicare Advantage','Medicare Supplement Insurance','Other'];
  const pharmacies = ['CVS','Walgreens','Walmart',"Sam's Club",'Costco','Rite Aid','Other'];
  const financialCarriers = ['American Equity Inv.','American General','Equitrust','F&G','Mass Mutual','Nationwide','Silac','Other'];
  const financialProducts = ['Annuity','Indexed Universal Life (IUL)','Whole Life','Term Life','Mutual Funds','401(k) / IRA','CD / Savings','Other'];

  const input = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const select = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const label = { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' };
  const row = { display: 'flex', gap: '12px', marginBottom: '12px' };
  const col = { flex: 1 };
  const sectionTitle = { fontSize: '13px', fontWeight: '700', color: RED, textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #F5E8E8' };
  const conditionalBox = { backgroundColor: '#FDF5F5', border: '1px solid #E8C8C8', borderRadius: '8px', padding: '16px', marginBottom: '12px' };
  const mutedBox = { backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px', marginBottom: '12px', color: '#888', fontSize: '13px', fontStyle: 'italic' };

  const clientName = [form.first_name, form.middle_name, form.last_name].filter(Boolean).join(' ') || form.name || 'Client';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90vw', maxWidth: '720px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        <div style={{ backgroundColor: BLACK, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderBottom: '4px solid ' + RED }}>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{clientName}</h2>
            <p style={{ color: CREAM, fontSize: '13px', margin: '2px 0 0' }}>{form.status}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '2px solid #E0E0E0', backgroundColor: '#F8F9FA', flexShrink: 0, overflowX: 'auto' }}>
          {['demographics', 'health', 'life', 'financial', 'notes'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab ? '700' : '400', color: activeTab === tab ? RED : '#666', borderBottom: activeTab === tab ? '2px solid ' + RED : 'none', backgroundColor: 'transparent', border: 'none', marginBottom: '-2px', whiteSpace: 'nowrap' }}>
              {tab === 'demographics' ? '👤 Demographics' : tab === 'health' ? '🏥 Health Insurance' : tab === 'life' ? '🛡️ Life Insurance' : tab === 'financial' ? '💰 Financial' : '📝 Notes'}
            </button>
          ))}
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

          {activeTab === 'demographics' && (
            <div>
              <p style={sectionTitle}>Client Name</p>
              <div style={row}>
                <div style={col}><label style={label}>First Name</label><input style={input} name="first_name" value={form.first_name || ''} onChange={handleChange} /></div>
                <div style={{ flex: 0.6 }}><label style={label}>Middle Name</label><input style={input} name="middle_name" value={form.middle_name || ''} onChange={handleChange} /></div>
                <div style={col}><label style={label}>Last Name</label><input style={input} name="last_name" value={form.last_name || ''} onChange={handleChange} /></div>
              </div>

              <p style={sectionTitle}>Marital Status</p>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', marginRight: '20px' }}>
                  <input type="radio" checked={!isMarried} onChange={() => setForm({ ...form, is_married: false })} style={{ marginRight: '6px' }} />No
                </label>
                <label style={{ fontSize: '14px' }}>
                  <input type="radio" checked={isMarried} onChange={() => setForm({ ...form, is_married: true })} style={{ marginRight: '6px' }} />Yes
                </label>
              </div>
              {isMarried && (
                <div style={conditionalBox}>
                  <p style={{ ...sectionTitle, marginBottom: '12px' }}>Spouse Information</p>
                  <div style={row}>
                    <div style={col}><label style={label}>Spouse First Name</label><input style={input} name="spouse_first_name" value={form.spouse_first_name || ''} onChange={handleChange} /></div>
                    <div style={{ flex: 0.6 }}><label style={label}>Middle</label><input style={input} name="spouse_middle_name" value={form.spouse_middle_name || ''} onChange={handleChange} /></div>
                    <div style={col}><label style={label}>Spouse Last Name</label><input style={input} name="spouse_last_name" value={form.spouse_last_name || ''} onChange={handleChange} /></div>
                  </div>
                  <div><label style={label}>Spouse Date of Birth</label><input style={{ ...input, width: '200px' }} type="date" name="spouse_dob" value={form.spouse_dob ? form.spouse_dob.split('T')[0] : ''} onChange={handleChange} /></div>
                </div>
              )}

              <p style={sectionTitle}>Personal Details</p>
              <div style={row}>
                <div style={col}><label style={label}>Date of Birth</label><input style={input} type="date" name="dob" value={form.dob ? form.dob.split('T')[0] : ''} onChange={handleChange} /></div>
                <div style={col}><label style={label}>Phone</label><input style={input} name="phone" value={form.phone || ''} onChange={handleChange} /></div>
                <div style={col}><label style={label}>Email</label><input style={input} name="email" value={form.email || ''} onChange={handleChange} /></div>
              </div>

              <p style={sectionTitle}>Home Address</p>
              <div style={{ marginBottom: '12px' }}><label style={label}>Street Address</label><input style={input} name="address_street" value={form.address_street || ''} onChange={handleChange} /></div>
              <div style={row}>
                <div style={{ flex: 0.5 }}><label style={label}>Suite / Apt</label><input style={input} name="address_suite" value={form.address_suite || ''} onChange={handleChange} /></div>
                <div style={{ flex: 0.5 }}><label style={label}>Zip Code</label><input style={input} name="address_zip" value={form.address_zip || ''} onChange={handleChange} /></div>
                <div style={col}><label style={label}>City</label><input style={input} name="address_city" value={form.address_city || ''} onChange={handleChange} /></div>
              </div>
              <div style={row}>
                <div style={col}><label style={label}>State</label><input style={input} name="address_state" value={form.address_state || ''} onChange={handleChange} /></div>
                <div style={col}><label style={label}>County</label><input style={input} name="address_county" value={form.address_county || ''} onChange={handleChange} /></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>