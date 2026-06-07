import React, { useState } from 'react';

const API = 'https://policy-desk-production.up.railway.app';

const HEALTH_CARRIERS = ['Aetna', 'Anthem', 'Cigna', 'Devoted', 'Essence', 'Humana', 'United Health', 'Other'];
const HEALTH_PLAN_TYPES = ['HMO', 'PPO', 'EPO', 'Medicare Advantage', 'Medicare Supplement Insurance', 'Other'];
const PHYSICIAN_SPECIALTIES = ['Allergist', 'Cardiologist', 'Dermatologist', 'Endocrinologist', 'Family Medicine', 'Gastroenterologist', 'Geriatrician', 'Gynecologist', 'Hematologist', 'Infectious Disease', 'Internal Medicine', 'Nephrologist', 'Neurologist', 'Oncologist', 'Ophthalmologist', 'Orthopedic Surgeon', 'Otolaryngologist (ENT)', 'Pediatrician', 'Physiatrist', 'Plastic Surgeon', 'Primary Care Physician', 'Psychiatrist', 'Pulmonologist', 'Radiologist', 'Rheumatologist', 'Urologist', 'Other'];
const PHARMACIES = ['CVS', 'Walgreens', 'Walmart', "Sam's Club", 'Costco', 'Rite Aid', 'Kroger', 'Publix', 'Other'];
const LIFE_CARRIERS = ['American Amicable', 'Allstate', 'Cica', 'Columbian', 'Foresters', 'Gerber', 'GTL', 'Mutual of Omaha', 'TransAmerica', 'Other'];
const LIFE_PLAN_TYPES = ['Universal Life (UL)', 'Index UL', 'Whole Life', 'Term Life', 'Final Expense', 'Ancillary Product', 'Hospital Indemnity', 'Critical Care', 'Chronic Conditions', 'Cancer Coverage', "Children's Policy"];
const FINANCIAL_CARRIERS = ['American Equity Inv.', 'American General', 'Equitrust', 'F&G', 'Mass Mutual', 'Nationwide', 'Silac', 'Other'];
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const GREEN = '#2B5C2B';
const GOLD = '#C9A227';

const s = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', borderRadius: '12px', width: '680px', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
  header: { backgroundColor: GREEN, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
  tabs: { display: 'flex', borderBottom: '2px solid #E0E0E0', backgroundColor: '#F8F9FA', overflowX: 'auto' },
  body: { padding: '20px 24px', overflowY: 'auto', flex: 1, maxHeight: '65vh' },
  row: { display: 'flex', gap: '10px', marginBottom: '10px' },
  col: { flex: 1 },
  label: { display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
  input: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box', minHeight: '70px', resize: 'vertical' },
  sectionTitle: { fontSize: '12px', fontWeight: '700', color: GREEN, textTransform: 'uppercase', marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #E8F5E8', marginTop: '16px' },
  footer: { padding: '14px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: { padding: '8px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '13px', backgroundColor: 'white' },
  saveBtn: { padding: '8px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', backgroundColor: GOLD, color: 'white', fontWeight: '600' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
};

function tabStyle(active) {
  return { padding: '10px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '700' : '400', color: active ? GREEN : '#666', borderBottom: active ? '2px solid ' + GREEN : 'none', backgroundColor: 'transparent', border: 'none', marginBottom: '-2px', whiteSpace: 'nowrap' };
}

function typeCheckboxStyle(selected) {
  return { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', border: '2px solid ' + (selected ? GREEN : '#ddd'), backgroundColor: selected ? '#E8F5E8' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: selected ? '700' : '400', color: selected ? GREEN : '#555' };
}

function ClientForm({ onSave, onClose }) {
  const [activeTab, setActiveTab] = useState('demographics');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: '', middle_name: '', last_name: '',
    email: '', phone: '', dob: '',
    is_married: false,
    spouse_first_name: '', spouse_middle_name: '', spouse_last_name: '',
    address_street: '', address_suite: '', address_zip: '', address_city: '', address_state: '', address_county: '',
    mailing_different: false, mailing_address: '',
    client_types: [], smoker: false, household_size: '',
    status: 'lead', source: 'manual',
    health_carrier: '', health_plan_type: '', health_plan_type_other: '',
    primary_hospital_name: '', primary_hospital_location: '',
    physician_name: '', physician_specialty: '',
    pharmacy_name: '', pharmacy_other: '', pharmacy_address: '', pharmacy_phone: '',
    life_carrier: '', life_carrier_other: '', life_plan_type: '',
    financial_carrier: '', financial_carrier_other: '', plan_start_date: '',
    current_financial_products: '', interested_financial_products: '',
    retirement_goal_age: '', risk_tolerance: '',
    notes: '', last_contacted: '',
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleClientTypeChange(type) {
    setForm(f => {
      const types = f.client_types.includes(type)
        ? f.client_types.filter(t => t !== type)
        : [...f.client_types, type];
      return { ...f, client_types: types };
    });
  }

  function getReminderDate(startDate) {
    if (!startDate) return null;
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + 11);
    return d.toLocaleDateString();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const clientType = form.client_types.includes('Finance') && (form.client_types.includes('Health') || form.client_types.includes('Life')) ? 'both' : form.client_types.includes('Finance') ? 'financial' : 'insurance';
      const payload = {
        ...form,
        name: `${form.first_name} ${form.middle_name} ${form.last_name}`.trim(),
        client_types: form.client_types.join(','),
        client_type: clientType,
        address: form.address_street,
      };
      const res = await fetch(`${API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onSave();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  const tabs = [
    { key: 'demographics', label: '👤 Demographics' },
    { key: 'health', label: '🏥 Health Ins.' },
    { key: 'life', label: '💙 Life Ins.' },
    { key: 'financial', label: '💰 Financial' },
    { key: 'notes', label: '📝 Notes' },
  ];

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.headerTitle}>New Client Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={s.tabs}>
          {tabs.map(tab => (
            <button key={tab.key} style={tabStyle(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={s.body}>

            {activeTab === 'demographics' && (
              <div>
                <p style={s.sectionTitle}>Client Name</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>First Name *</label>
                    <input style={s.input} name="first_name" value={form.first_name} onChange={handleChange} required />
                  </div>
                  <div style={{ flex: 0.6 }}>
                    <label style={s.label}>Middle</label>
                    <input style={s.input} name="middle_name" value={form.middle_name} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Last Name *</label>
                    <input style={s.input} name="last_name" value={form.last_name} onChange={handleChange} required />
                  </div>
                </div>

                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Date of Birth</label>
                    <input style={s.input} type="date" name="dob" value={form.dob} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Phone</label>
                    <input style={s.input} name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Email</label>
                    <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>

                <div style={s.checkboxRow}>
                  <input type="checkbox" id="married" name="is_married" checked={form.is_married} onChange={handleChange} />
                  <label htmlFor="married" style={{ fontSize: '13px', cursor: 'pointer' }}>Married?</label>
                </div>

                {form.is_married && (
                  <div>
                    <p style={s.sectionTitle}>Spouse Information</p>
                    <div style={s.row}>
                      <div style={s.col}>
                        <label style={s.label}>Spouse First Name</label>
                        <input style={s.input} name="spouse_first_name" value={form.spouse_first_name} onChange={handleChange} />
                      </div>
                      <div style={{ flex: 0.6 }}>
                        <label style={s.label}>Middle</label>
                        <input style={s.input} name="spouse_middle_name" value={form.spouse_middle_name} onChange={handleChange} />
                      </div>
                      <div style={s.col}>
                        <label style={s.label}>Spouse Last Name</label>
                        <input style={s.input} name="spouse_last_name" value={form.spouse_last_name} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}

                <p style={s.sectionTitle}>Home Address</p>
                <div style={{ marginBottom: '10px' }}>
                  <label style={s.label}>Street Address</label>
                  <input style={s.input} name="address_street" value={form.address_street} onChange={handleChange} />
                </div>
                <div style={s.row}>
                  <div style={{ flex: 0.5 }}>
                    <label style={s.label}>Suite / Apt</label>
                    <input style={s.input} name="address_suite" value={form.address_suite} onChange={handleChange} />
                  </div>
                  <div style={{ flex: 0.5 }}>
                    <label style={s.label}>Zip Code</label>
                    <input style={s.input} name="address_zip" value={form.address_zip} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>City</label>
                    <input style={s.input} name="address_city" value={form.address_city} onChange={handleChange} />
                  </div>
                </div>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>State</label>
                    <select style={s.select} name="address_state" value={form.address_state} onChange={handleChange}>
                      <option value="">Select...</option>
                      {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>County</label>
                    <input style={s.input} name="address_county" value={form.address_county} onChange={handleChange} />
                  </div>
                </div>

                <div style={s.checkboxRow}>
                  <input type="checkbox" id="mailing" name="mailing_different" checked={form.mailing_different} onChange={handleChange} />
                  <label htmlFor="mailing" style={{ fontSize: '13px', cursor: 'pointer' }}>Mailing address is different from home address</label>
                </div>

                {form.mailing_different && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Mailing Address</label>
                    <textarea style={s.textarea} name="mailing_address" value={form.mailing_address} onChange={handleChange} placeholder="Full mailing address..." />
                  </div>
                )}

                <p style={s.sectionTitle}>Client Type</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {['Health', 'Life', 'Finance'].map(type => (
                    <div key={type} style={typeCheckboxStyle(form.client_types.includes(type))} onClick={() => handleClientTypeChange(type)}>
                      {type === 'Health' ? '🏥' : type === 'Life' ? '💙' : '💰'} {type}
                    </div>
                  ))}
                </div>

                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Status</label>
                    <select style={s.select} name="status" value={form.status} onChange={handleChange}>
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="active">Active Client</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
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
                    <label style={s.label}>Smoker?</label>
                    <select style={s.select} name="smoker" value={form.smoker} onChange={handleChange}>
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div>
                <p style={s.sectionTitle}>Health Insurance</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Current Carrier</label>
                    <select style={s.select} name="health_carrier" value={form.health_carrier} onChange={handleChange}>
                      <option value="">Select...</option>
                      {HEALTH_CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Plan Type</label>
                    <select style={s.select} name="health_plan_type" value={form.health_plan_type} onChange={handleChange}>
                      <option value="">Select...</option>
                      {HEALTH_PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                {form.health_plan_type === 'Other' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Specify Plan Type</label>
                    <input style={s.input} name="health_plan_type_other" value={form.health_plan_type_other} onChange={handleChange} placeholder="Enter plan type..." />
                  </div>
                )}

                <p style={s.sectionTitle}>Primary Hospital</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Hospital Name</label>
                    <input style={s.input} name="primary_hospital_name" value={form.primary_hospital_name} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Location</label>
                    <input style={s.input} name="primary_hospital_location" value={form.primary_hospital_location} onChange={handleChange} />
                  </div>
                </div>

                <p style={s.sectionTitle}>Physician</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Physician Name</label>
                    <input style={s.input} name="physician_name" value={form.physician_name} onChange={handleChange} placeholder="Dr. Name" />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Specialty</label>
                    <select style={s.select} name="physician_specialty" value={form.physician_specialty} onChange={handleChange}>
                      <option value="">Select...</option>
                      {PHYSICIAN_SPECIALTIES.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                    </select>
                  </div>
                </div>

                <p style={s.sectionTitle}>Preferred Pharmacy</p>
                <div style={{ marginBottom: '10px' }}>
                  <label style={s.label}>Pharmacy</label>
                  <select style={s.select} name="pharmacy_name" value={form.pharmacy_name} onChange={handleChange}>
                    <option value="">Select...</option>
                    {PHARMACIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {form.pharmacy_name === 'Other' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Pharmacy Name</label>
                    <input style={s.input} name="pharmacy_other" value={form.pharmacy_other} onChange={handleChange} />
                  </div>
                )}
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Pharmacy Address</label>
                    <input style={s.input} name="pharmacy_address" value={form.pharmacy_address} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Pharmacy Phone</label>
                    <input style={s.input} name="pharmacy_phone" value={form.pharmacy_phone} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'life' && (
              <div>
                <p style={s.sectionTitle}>Life Insurance</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Current Carrier</label>
                    <select style={s.select} name="life_carrier" value={form.life_carrier} onChange={handleChange}>
                      <option value="">Select...</option>
                      {LIFE_CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Plan Type</label>
                    <select style={s.select} name="life_plan_type" value={form.life_plan_type} onChange={handleChange}>
                      <option value="">Select...</option>
                      {LIFE_PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                {form.life_carrier === 'Other' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Specify Carrier</label>
                    <input style={s.input} name="life_carrier_other" value={form.life_carrier_other} onChange={handleChange} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'financial' && (
              <div>
                <p style={s.sectionTitle}>Financial Products</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Current Carrier</label>
                    <select style={s.select} name="financial_carrier" value={form.financial_carrier} onChange={handleChange}>
                      <option value="">Select...</option>
                      {FINANCIAL_CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Plan Start Date</label>
                    <input style={s.input} type="date" name="plan_start_date" value={form.plan_start_date} onChange={handleChange} />
                  </div>
                </div>
                {form.financial_carrier === 'Other' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={s.label}>Specify Carrier</label>
                    <input style={s.input} name="financial_carrier_other" value={form.financial_carrier_other} onChange={handleChange} />
                  </div>
                )}
                {form.plan_start_date && (
                  <div style={{ backgroundColor: '#FDF8E8', border: '1px solid #C9A227', borderRadius: '6px', padding: '10px', marginTop: '8px', marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
                      📅 11-month reminder will be set for {getReminderDate(form.plan_start_date)}
                    </p>
                  </div>
                )}
                <div style={{ marginBottom: '10px', marginTop: '12px' }}>
                  <label style={s.label}>Current Financial Products</label>
                  <input style={s.input} name="current_financial_products" value={form.current_financial_products} onChange={handleChange} placeholder="e.g. IRA, 401k, Annuity..." />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={s.label}>Interested Financial Products</label>
                  <input style={s.input} name="interested_financial_products" value={form.interested_financial_products} onChange={handleChange} placeholder="e.g. Annuity, Roth IRA..." />
                </div>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Retirement Goal Age</label>
                    <input style={s.input} type="number" name="retirement_goal_age" value={form.retirement_goal_age} onChange={handleChange} />
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
                <p style={s.sectionTitle}>Notes and Activity</p>
                <label style={s.label}>Notes</label>
                <textarea style={s.textarea} name="notes" value={form.notes} onChange={handleChange} placeholder="Add notes about this client..." />
                <div style={{ marginTop: '12px' }}>
                  <label style={s.label}>Last Contacted</label>
                  <input style={s.input} type="date" name="last_contacted" value={form.last_contacted} onChange={handleChange} />
                </div>
              </div>
            )}

          </div>

          <div style={s.footer}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={s.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;