import React, { useState } from 'react';

function ClientForm({ onSave, onClose }) {
  const [form, setForm] = useState({
    first_name: '', middle_name: '', last_name: '',
    email: '', phone: '', dob: '',
    is_married: false,
    spouse_first_name: '', spouse_middle_name: '', spouse_last_name: '', spouse_dob: '',
    address_street: '', address_suite: '', address_zip: '', address_city: '', address_state: '', address_county: '',
    mailing_different: false,
    mailing_address: '',
    client_types: [],
    status: 'lead', source: 'manual', smoker: false, household_size: '',
    assigned_to: 'Terrell Lane',
    health_carrier: '', health_plan_type: '', health_plan_type_other: '', plan_start_date: '',
    primary_hospital_name: '', primary_hospital_location: '',
    physicians: [],
    pharmacy_name: '', pharmacy_other: '', pharmacy_address: '', pharmacy_phone: '',
    spouse_health_carrier: '', spouse_health_plan_type: '', spouse_health_plan_type_other: '', spouse_plan_start_date: '',
    life_carrier: '', life_carrier_other: '', life_plan_type: '', coverage_type: '', interested_coverage: '', life_plan_start_date: '',
    current_financial_products: '', interested_financial_products: '', retirement_goal_age: '', risk_tolerance: '',
    notes: '', last_contacted: ''
  });

  const [activeTab, setActiveTab] = useState('demographics');
  const [error, setError] = useState('');

  const GREEN = '#2B5C2B';
  const GOLD = '#C9A227';

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === 'client_types') {
      const updated = checked
        ? [...form.client_types, value]
        : form.client_types.filter(t => t !== value);
      setForm({ ...form, client_types: updated });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  }

  function addPhysician() {
    setForm({ ...form, physicians: [...form.physicians, { name: '', specialty: '' }] });
  }

  function removePhysician(index) {
    const updated = form.physicians.filter((_, i) => i !== index);
    setForm({ ...form, physicians: updated });
  }

  function handlePhysicianChange(index, field, value) {
    const updated = form.physicians.map((p, i) => i === index ? { ...p, [field]: value } : p);
    setForm({ ...form, physicians: updated });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        name: `${form.first_name} ${form.last_name}`.trim(),
        client_types: form.client_types.join(','),
        physician_name: form.physicians.map(p => p.name).join('; '),
        physician_specialty: form.physicians.map(p => p.specialty).join('; '),
      };
      const res = await fetch('https://policy-desk-production.up.railway.app/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || err.message || 'Failed to save client.');
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
    modal: { backgroundColor: 'white', borderRadius: '12px', width: '90vw', maxWidth: '720px', height: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' },
    header: { backgroundColor: GREEN, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
    tabs: { display: 'flex', borderBottom: '2px solid #E0E0E0', backgroundColor: '#F8F9FA', overflowX: 'auto', flexShrink: 0 },
    tab: (active) => ({ padding: '12px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: active ? '700' : '400', color: active ? GREEN : '#666', borderBottom: active ? '2px solid ' + GREEN : 'none', backgroundColor: 'transparent', border: 'none', marginBottom: '-2px', whiteSpace: 'nowrap' }),
    body: { padding: '24px', overflowY: 'scroll', flex: '1 1 0', minHeight: 0 },
    row: { display: 'flex', gap: '12px', marginBottom: '12px' },
    col: { flex: 1 },
    label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' },
    input: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' },
    sectionTitle: { fontSize: '13px', fontWeight: '700', color: GREEN, textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #E8F0FA' },
    conditionalBox: { backgroundColor: '#F8FAF8', border: '1px solid #D0E4D0', borderRadius: '8px', padding: '16px', marginBottom: '12px' },
    mutedBox: { backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px', marginBottom: '12px', color: '#888', fontSize: '13px', fontStyle: 'italic' },
    physicianCard: { border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px', marginBottom: '8px', backgroundColor: '#FAFAFA', position: 'relative' },
    addBtn: { backgroundColor: 'transparent', border: '1px solid ' + GREEN, color: GREEN, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '12px' },
    removeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    footer: { padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cancelBtn: { padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' },
    saveBtn: { padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: GOLD, color: 'white', fontWeight: '600' },
    errorMsg: { color: '#c0392b', fontSize: '13px' },
  };

  const specialties = ['Cardiology','Dermatology','Endocrinology','Family Medicine','Gastroenterology','General Surgery','Geriatrics','Hematology','Internal Medicine','Nephrology','Neurology','Obstetrics & Gynecology','Oncology','Ophthalmology','Orthopedics','Otolaryngology (ENT)','Pediatrics','Psychiatry','Pulmonology','Radiology','Rheumatology','Urology','Other'];
  const healthCarriers = ['Aetna','Anthem','Cigna','Devoted','Essence','Humana','United Health'];
  const healthPlanTypes = ['HMO','PPO','EPO','Medicare Advantage','Medicare Supplement Insurance','Other'];
  const pharmacies = ['CVS','Walgreens','Walmart',"Sam's Club",'Costco','Rite Aid','Other'];
  const isMarried = form.is_married === true || form.is_married === 'true';

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <h2 style={s.headerTitle}>New Client Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={s.tabs}>
          {['demographics', 'health', 'life', 'financial', 'notes'].map(tab => (
            <button key={tab} style={s.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
              {tab === 'demographics' ? '👤 Demographics' : tab === 'health' ? '🏥 Health Insurance' : tab === 'life' ? '🛡️ Life Insurance' : tab === 'financial' ? '💰 Financial' : '📝 Notes'}
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
                    <label style={s.label}>Middle Name</label>
                    <input style={s.input} name="middle_name" value={form.middle_name} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Last Name *</label>
                    <input style={s.input} name="last_name" value={form.last_name} onChange={handleChange} required />
                  </div>
                </div>

                <p style={s.sectionTitle}>Marital Status</p>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', marginRight: '20px' }}>
                    <input type="radio" name="is_married" value="false" checked={!isMarried} onChange={() => setForm({ ...form, is_married: false, spouse_first_name: '', spouse_middle_name: '', spouse_last_name: '', spouse_dob: '' })} style={{ marginRight: '6px' }} />
                    No
                  </label>
                  <label style={{ fontSize: '14px' }}>
                    <input type="radio" name="is_married" value="true" checked={isMarried} onChange={() => setForm({ ...form, is_married: true })} style={{ marginRight: '6px' }} />
                    Yes
                  </label>
                </div>

                {isMarried && (
                  <div style={s.conditionalBox}>
                    <p style={{ ...s.sectionTitle, marginBottom: '12px' }}>Spouse Information</p>
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
                    <div>
                      <label style={s.label}>Spouse Date of Birth</label>
                      <input style={{ ...s.input, width: '200px' }} type="date" name="spouse_dob" value={form.spouse_dob} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <p style={s.sectionTitle}>Personal Details</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Date of Birth</label>
                    <input style={s.input} type="date" name="dob" value={form.dob} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Phone</label>
                    <input style={s.input} name="phone" value={form.phone} onChange={handleChange} placeholder="(000) 000-0000" />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Email</label>
                    <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>

                <p style={s.sectionTitle}>Home Address</p>
                <div style={{ marginBottom: '12px' }}>
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
                    <input style={s.input} name="address_state" value={form.address_state} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>County</label>
                    <input style={s.input} name="address_county" value={form.address_county} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="checkbox" name="mailing_different" checked={form.mailing_different} onChange={handleChange} id="mailing_different" />
                  <label htmlFor="mailing_different" style={{ fontSize: '14px', cursor: 'pointer' }}>Mailing address is different than home address</label>
                </div>

                {form.mailing_different && (
                  <div style={s.conditionalBox}>
                    <p style={{ ...s.sectionTitle, marginBottom: '12px' }}>Mailing Address</p>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={s.label}>Street Address</label>
                      <input style={s.input} name="mailing_address" value={form.mailing_address} onChange={handleChange} />
                    </div>
                  </div>
                )}

                <p style={s.sectionTitle}>Client Type</p>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                  {['Health Insurance', 'Life Insurance', 'Finance'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                      <input type="checkbox" name="client_types" value={type} checked={form.client_types.includes(type)} onChange={handleChange} />
                      {type}
                    </label>
                  ))}
                </div>

                <p style={s.sectionTitle}>Additional Info</p>
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
                    <label style={s.label}>Smoker?</label>
                    <select style={s.select} name="smoker" value={form.smoker} onChange={handleChange}>
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
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
                    <label style={s.label}>Household Size</label>
                    <input style={s.input} type="number" name="household_size" value={form.household_size} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Assigned Broker</label>
                    <select style={s.select} name="assigned_to" value={form.assigned_to} onChange={handleChange}>
                      <option value="Terrell Lane">Terrell Lane</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div>
                <p style={s.sectionTitle}>Client — Health Insurance</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Current Carrier</label>
                    <select style={s.select} name="health_carrier" value={form.health_carrier} onChange={handleChange}>
                      <option value="">Select...</option>
                      {healthCarriers.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Plan Type</label>
                    <select style={s.select} name="health_plan_type" value={form.health_plan_type} onChange={handleChange}>
                      <option value="">Select...</option>
                      {healthPlanTypes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                {form.health_plan_type === 'Other' && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={s.label}>Specify Plan Type</label>
                    <input style={s.input} name="health_plan_type_other" value={form.health_plan_type_other} onChange={handleChange} />
                  </div>
                )}
                <div style={{ marginBottom: '12px' }}>
                  <label style={s.label}>Policy Plan Start Date</label>
                  <input style={{ ...s.input, width: '200px' }} type="date" name="plan_start_date" value={form.plan_start_date} onChange={handleChange} />
                </div>

                <p style={s.sectionTitle}>Primary Hospital</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Hospital Network Name</label>
                    <input style={s.input} name="primary_hospital_name" value={form.primary_hospital_name} onChange={handleChange} />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Location (City, State)</label>
                    <input style={s.input} name="primary_hospital_location" value={form.primary_hospital_location} onChange={handleChange} />
                  </div>
                </div>

                <p style={s.sectionTitle}>Physicians</p>
                {form.physicians.map((physician, index) => (
                  <div key={index} style={s.physicianCard}>
                    <button type="button" style={s.removeBtn} onClick={() => removePhysician(index)}>✕</button>
                    <div style={s.row}>
                      <div style={s.col}>
                        <label style={s.label}>Physician Name</label>
                        <input style={s.input} value={physician.name} onChange={e => handlePhysicianChange(index, 'name', e.target.value)} />
                      </div>
                      <div style={s.col}>
                        <label style={s.label}>Specialty</label>
                        <select style={s.select} value={physician.specialty} onChange={e => handlePhysicianChange(index, 'specialty', e.target.value)}>
                          <option value="">Select...</option>
                          {specialties.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" style={s.addBtn} onClick={addPhysician}>+ Add Physician</button>

                <p style={s.sectionTitle}>Preferred Pharmacy</p>
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Pharmacy Name</label>
                    <select style={s.select} name="pharmacy_name" value={form.pharmacy_name} onChange={handleChange}>
                      <option value="">Select...</option>
                      {pharmacies.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                {form.pharmacy_name === 'Other' && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={s.label}>Specify Pharmacy Name</label>
                    <input style={s.input} name="pharmacy_other" value={form.pharmacy_other} onChange={handleChange} />
                  </div>
                )}
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Pharmacy Address</label>
                    <input style={s.input} name="pharmacy_address" value={form.pharmacy_address} onChange={handleChange} placeholder="Street, City, State" />
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Pharmacy Phone</label>
                    <input style={s.input} name="pharmacy_phone" value={form.pharmacy_phone} onChange={handleChange} placeholder="(000) 000-0000" />
                  </div>
                </div>

                <p style={s.sectionTitle}>Spouse — Health Insurance</p>
                {isMarried ? (
                  <div style={s.conditionalBox}>
                    <div style={s.row}>
                      <div style={s.col}>
                        <label style={s.label}>Spouse Current Carrier</label>
                        <select style={s.select} name="spouse_health_carrier" value={form.spouse_health_carrier} onChange={handleChange}>
                          <option value="">Select...</option>
                          {healthCarriers.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div style={s.col}>
                        <label style={s.label}>Spouse Plan Type</label>
                        <select style={s.select} name="spouse_health_plan_type" value={form.spouse_health_plan_type} onChange={handleChange}>
                          <option value="">Select...</option>
                          {healthPlanTypes.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    {form.spouse_health_plan_type === 'Other' && (
                      <div style={{ marginBottom: '12px' }}>
                        <label style={s.label}>Specify Spouse Plan Type</label>
                        <input style={s.input} name="spouse_health_plan_type_other" value={form.spouse_health_plan_type_other} onChange={handleChange} />
                      </div>
                    )}
                    <div>
                      <label style={s.label}>Spouse Policy Plan Start Date</label>
                      <input style={{ ...s.input, width: '200px' }} type="date" name="spouse_plan_start_date" value={form.spouse_plan_start_date} onChange={handleChange} />
                    </div>
                  </div>
                ) : (
                  <div style={s.mutedBox}>
                    Mark client as married in the Demographic tab to unlock spouse insurance fields.
                  </div>
                )}
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
                      {['American Amicable','Allstate','Cica','Columbian','Foresters','Gerber','GTL','Mutual of Omaha','TransAmerica','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Current Plan Type</label>
                    <select style={s.select} name="life_plan_type" value={form.life_plan_type} onChange={handleChange}>
                      <option value="">Select...</option>
                      {['Universal Life (UL)','Index UL','Whole Life','Term Life','Final Expense',"Children's Policy",'Ancillary Health Product'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                {form.life_carrier === 'Other' && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={s.label}>Specify Carrier</label>
                    <input style={s.input} name="life_carrier_other" value={form.life_carrier_other} onChange={handleChange} />
                  </div>
                )}
                <div style={s.row}>
                  <div style={s.col}>
                    <label style={s.label}>Coverage Type</label>
                    <select style={s.select} name="coverage_type" value={form.coverage_type} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="Individual">Individual</option>
                      <option value="Joint">Joint</option>
                    </select>
                  </div>
                  <div style={s.col}>
                    <label style={s.label}>Interested Coverage</label>
                    <input style={s.input} name="interested_coverage" value={form.interested_coverage} onChange={handleChange} placeholder="e.g. $250,000" />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Policy Plan Start Date</label>
                  <input style={{ ...s.input, width: '200px' }} type="date" name="life_plan_start_date" value={form.life_plan_start_date} onChange={handleChange} />
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