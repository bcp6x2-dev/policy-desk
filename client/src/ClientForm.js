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

  const specialties = ['Cardiology','Dermatology','Endocrinology','Family Medicine','Gastroenterology','General Surgery','Geriatrics','Hematology','Internal Medicine','Nephrology','Neurology','Obstetrics & Gynecology','Oncology','Ophthalmology','Orthopedics','Otolaryngology (ENT)','Pediatrics','Psychiatry','Pulmonology','Radiology','Rheumatology','Urology','Other'];
  const healthCarriers = ['Aetna','Anthem','Cigna','Devoted','Essence','Humana','United Health'];
  const healthPlanTypes = ['HMO','PPO','EPO','Medicare Advantage','Medicare Supplement Insurance','Other'];
  const pharmacies = ['CVS','Walgreens','Walmart',"Sam's Club",'Costco','Rite Aid','Other'];
  const isMarried = form.is_married === true || form.is_married === 'true';

  const input = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const select = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const label = { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase' };
  const row = { display: 'flex', gap: '12px', marginBottom: '12px' };
  const col = { flex: 1 };
  const sectionTitle = { fontSize: '13px', fontWeight: '700', color: GREEN, textTransform: 'uppercase', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #E8F0FA' };
  const conditionalBox = { backgroundColor: '#F8FAF8', border: '1px solid #D0E4D0', borderRadius: '8px', padding: '16px', marginBottom: '12px' };
  const mutedBox = { backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px', marginBottom: '12px', color: '#888', fontSize: '13px', fontStyle: 'italic' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90vw', maxWidth: '720px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        {/* HEADER */}
        <div style={{ backgroundColor: GREEN, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>New Client Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E0E0E0', backgroundColor: '#F8F9FA', flexShrink: 0, overflowX: 'auto' }}>
          {['demographics', 'health', 'life', 'financial', 'notes'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab ? '700' : '400', color: activeTab === tab ? GREEN : '#666', borderBottom: activeTab === tab ? '2px solid ' + GREEN : 'none', backgroundColor: 'transparent', border: 'none', marginBottom: '-2px', whiteSpace: 'nowrap' }}>
              {tab === 'demographics' ? '👤 Demographics' : tab === 'health' ? '🏥 Health Insurance' : tab === 'life' ? '🛡️ Life Insurance' : tab === 'financial' ? '💰 Financial' : '📝 Notes'}
            </button>
          ))}
        </div>

        {/* SCROLLABLE BODY */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
          <form onSubmit={handleSubmit}>

            {activeTab === 'demographics' && (
              <div>
                <p style={sectionTitle}>Client Name</p>
                <div style={row}>
                  <div style={col}><label style={label}>First Name *</label><input style={input} name="first_name" value={form.first_name} onChange={handleChange} required /></div>
                  <div style={{ flex: 0.6 }}><label style={label}>Middle Name</label><input style={input} name="middle_name" value={form.middle_name} onChange={handleChange} /></div>
                  <div style={col}><label style={label}>Last Name *</label><input style={input} name="last_name" value={form.last_name} onChange={handleChange} required /></div>
                </div>

                <p style={sectionTitle}>Marital Status</p>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', marginRight: '20px' }}>
                    <input type="radio" checked={!isMarried} onChange={() => setForm({ ...form, is_married: false, spouse_first_name: '', spouse_middle_name: '', spouse_last_name: '', spouse_dob: '' })} style={{ marginRight: '6px' }} />No
                  </label>
                  <label style={{ fontSize: '14px' }}>
                    <input type="radio" checked={isMarried} onChange={() => setForm({ ...form, is_married: true })} style={{ marginRight: '6px' }} />Yes
                  </label>
                </div>
                {isMarried && (
                  <div style={conditionalBox}>
                    <p style={{ ...sectionTitle, marginBottom: '12px' }}>Spouse Information</p>
                    <div style={row}>
                      <div style={col}><label style={label}>Spouse First Name</label><input style={input} name="spouse_first_name" value={form.spouse_first_name} onChange={handleChange} /></div>
                      <div style={{ flex: 0.6 }}><label style={label}>Middle</label><input style={input} name="spouse_middle_name" value={form.spouse_middle_name} onChange={handleChange} /></div>
                      <div style={col}><label style={label}>Spouse Last Name</label><input style={input} name="spouse_last_name" value={form.spouse_last_name} onChange={handleChange} /></div>
                    </div>
                    <div><label style={label}>Spouse Date of Birth</label><input style={{ ...input, width: '200px' }} type="date" name="spouse_dob" value={form.spouse_dob} onChange={handleChange} /></div>
                  </div>
                )}

                <p style={sectionTitle}>Personal Details</p>
                <div style={row}>
                  <div style={col}><label style={label}>Date of Birth</label><input style={input} type="date" name="dob" value={form.dob} onChange={handleChange} /></div>
                  <div style={col}><label style={label}>Phone</label><input style={input} name="phone" value={form.phone} onChange={handleChange} placeholder="(000) 000-0000" /></div>
                  <div style={col}><label style={label}>Email</label><input style={input} type="email" name="email" value={form.email} onChange={handleChange} /></div>
                </div>

                <p style={sectionTitle}>Home Address</p>
                <div style={{ marginBottom: '12px' }}><label style={label}>Street Address</label><input style={input} name="address_street" value={form.address_street} onChange={handleChange} /></div>
                <div style={row}>
                  <div style={{ flex: 0.5 }}><label style={label}>Suite / Apt</label><input style={input} name="address_suite" value={form.address_suite} onChange={handleChange} /></div>
                  <div style={{ flex: 0.5 }}><label style={label}>Zip Code</label><input style={input} name="address_zip" value={form.address_zip} onChange={handleChange} /></div>
                  <div style={col}><label style={label}>City</label><input style={input} name="address_city" value={form.address_city} onChange={handleChange} /></div>
                </div>
                <div style={row}>
                  <div style={col}><label style={label}>State</label><input style={input} name="address_state" value={form.address_state} onChange={handleChange} /></div>
                  <div style={col}><label style={label}>County</label><input style={input} name="address_county" value={form.address_county} onChange={handleChange} /></div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="checkbox" name="mailing_different" checked={form.mailing_different} onChange={handleChange} id="mailing_different" />
                  <label htmlFor="mailing_different" style={{ fontSize: '14px', cursor: 'pointer' }}>Mailing address is different than home address</label>
                </div>
                {form.mailing_different && (
                  <div style={conditionalBox}>
                    <p style={{ ...sectionTitle, marginBottom: '12px' }}>Mailing Address</p>
                    <div style={{ marginBottom: '12px' }}><label style={label}>Street Address</label><input style={input} name="mailing_address" value={form.mailing_address} onChange={handleChange} /></div>
                  </div>
                )}

                <p style={sectionTitle}>Client Type</p>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                  {['Health Insurance', 'Life Insurance', 'Finance'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                      <input type="checkbox" name="client_types" value={type} checked={form.client_types.includes(type)} onChange={handleChange} />{type}
                    </label>
                  ))}
                </div>

                <p style={sectionTitle}>Additional Info</p>
                <div style={row}>
                  <div style={col}><label style={label}>Source</label><select style={select} name="source" value={form.source} onChange={handleChange}><option value="manual">Manual Entry</option><option value="referral">Referral</option><option value="web_form">Web Form</option><option value="imported">Imported</option></select></div>
                  <div style={col}><label style={label}>Smoker?</label><select style={select} name="smoker" value={form.smoker} onChange={handleChange}><option value={false}>No</option><option value={true}>Yes</option></select></div>
                  <div style={col}><label style={label}>Status</label><select style={select} name="status" value={form.status} onChange={handleChange}><option value="lead">Lead</option><option value="prospect">Prospect</option><option value="active">Active Client</option><option value="inactive">Inactive</option></select></div>
                </div>
                <div style={row}>
                  <div style={col}><label style={label}>Household Size</label><input style={input} type="number" name="household_size" value={form.household_size} onChange={handleChange} /></div>
                  <div style={col}><label style={label}>Assigned Broker</label><select style={select} name="assigned_to" value={form.assigned_to} onChange={handleChange}><option value="Terrell Lane">Terrell Lane</option></select></div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div>
                <p style={sectionTitle}>Client — Health Insurance</p>
                <div style={row}>
                  <div style={col}><label style={label}>Current Carrier</label><select style={select} name="health_carrier" value={form.health_carrier} onChange={handleChange}><option value="">Select...</option>{healthCarriers.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div style={col}><label style={label}>Plan Type</label><select style={select} name="health_plan_type" value={form.health_plan_type} onChange={handleChange}><option value="">Select...</option>{healthPlanTypes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                </div>
                {form.health_plan_type === 'Other' && (<div style={{ marginBottom: '12px' }}><label style={label}>Specify Plan Type</label><input style={input} name="health_plan_type_other" value={form.health_plan_type_other} onChange={handleChange} /></div>)}
                <div style={{ marginBottom: '12px' }}><label style={label}>Policy Plan Start Date</label><input style={{ ...input, width: '200px' }} type="date" name="plan_start_date" value={form.plan_start_date} onChange={handleChange} /></div>

                <p style={sectionTitle}>Primary Hospital</p>
                <div style={row}>
                  <div style={col}><label style={label}>Hospital Network Name</label><input style={input} name="primary_hospital_name" value={form.primary_hospital_name} onChange={handleChange} /></div>
                  <div style={col}><label style={label}>Location (City, State)</label><input style={input} name="primary_hospital_location" value={form.primary_hospital_location} onChange={handleChange} /></div>
                </div>

                <p style={sectionTitle}>Physicians</p>
                {form.physicians.map((physician, index) => (
                  <div key={index} style={{ border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px', marginBottom: '8px', backgroundColor: '#FAFAFA', position: 'relative' }}>
                    <button type="button" onClick={() => removePhysician(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
                    <div style={row}>
                      <div style={col}><label style={label}>Physician Name</label><input style={input} value={physician.name} onChange={e => handlePhysicianChange(index, 'name', e.target.value)} /></div>
                      <div style={col}><label style={label}>Specialty</label><select style={select} value={physician.specialty} onChange={e => handlePhysicianChange(index, 'specialty', e.target.value)}><option value="">Select...</option>{specialties.map(sp => <option key={sp} value={sp}>{sp}</option>)}</select></div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addPhysician} style={{ backgroundColor: 'transparent', border: '1px solid ' + GREEN, color: GREEN, padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>+ Add Physician</button>

                <p style={sectionTitle}>Preferred Pharmacy</p>
                <div style={{ marginBottom: '12px' }}><label style={label}>Pharmacy Name</label><select style={select} name="pharmacy_name" value={form.pharmacy_name} onChange={handleChange}><option value="">Select...</option>{pharmacies.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                {form.pharmacy_name === 'Other' && (<div style={{ marginBottom: '12px' }}><label style={label}>Specify Pharmacy Name</label><input style={input} name="pharmacy_other" value={form.pharmacy_other} onChange={handleChange} /></div>)}
                <div style={row}>
                  <div style={col}><label style={label}>Pharmacy Address</label><input style={input} name="pharmacy_address" value={form.pharmacy_address} onChange={handleChange} placeholder="Street, City, State" /></div>
                  <div style={col}><label style={label}>Pharmacy Phone</label><input style={input} name="pharmacy_phone" value={form.pharmacy_phone} onChange={handleChange} placeholder="(000) 000-0000" /></div>
                </div>

                <p style={sectionTitle}>Spouse — Health Insurance</p>
                {isMarried ? (
                  <div style={conditionalBox}>
                    <div style={row}>
                      <div style={col}><label style={label}>Spouse Current Carrier</label><select style={select} name="spouse_health_carrier" value={form.spouse_health_carrier} onChange={handleChange}><option value="">Select...</option>{healthCarriers.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div style={col}><label style={label}>Spouse Plan Type</label><select style={select} name="spouse_health_plan_type" value={form.spouse_health_plan_type} onChange={handleChange}><option value="">Select...</option>{healthPlanTypes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    </div>
                    {form.spouse_health_plan_type === 'Other' && (<div style={{ marginBottom: '12px' }}><label style={label}>Specify Spouse Plan Type</label><input style={input} name="spouse_health_plan_type_other" value={form.spouse_health_plan_type_other} onChange={handleChange} /></div>)}
                    <div><label style={label}>Spouse Policy Plan Start Date</label><input style={{ ...input, width: '200px' }} type="date" name="spouse_plan_start_date" value={form.spouse_plan_start_date} onChange={handleChange} /></div>
                  </div>
                ) : (
                  <div style={mutedBox}>Mark client as married in the Demographic tab to unlock spouse insurance fields.</div>
                )}
              </div>
            )}

            {activeTab === 'life' && (
              <div>
                <p style={sectionTitle}>Life Insurance</p>
                <div style={row}>
                  <div style={col}><label style={label}>Current Carrier</label><select style={select} name="life_carrier" value={form.life_carrier} onChange={handleChange}><option value="">Select...</option>{['American Amicable','Allstate','Cica','Columbian','Foresters','Gerber','GTL','Mutual of Omaha','TransAmerica','Other'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div style={col}><label style={label}>Current Plan Type</label><select style={select} name="life_plan_type" value={form.life_plan_type} onChange={handleChange}><option value="">Select...</option>{['Universal Life (UL)','Index UL','Whole Life','Term Life','Final Expense',"Children's Policy",'Ancillary Health Product'].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                </div>
                {form.life_carrier === 'Other' && (<div style={{ marginBottom: '12px' }}><label style={label}>Specify Carrier</label><input style={input} name="life_carrier_other" value={form.life_carrier_other} onChange={handleChange} /></div>)}
                <div style={row}>
                  <div style={col}><label style={label}>Coverage Type</label><select style={select} name="coverage_type" value={form.coverage_type} onChange={handleChange}><option value="">Select...</option><option value="Individual">Individual</option><option value="Joint">Joint</option></select></div>
                  <div style={col}><label style={label}>Interested Coverage</label><input style={input} name="interested_coverage" value={form.interested_coverage} onChange={handleChange} placeholder="e.g. $250,000" /></div>
                </div>
                <div><label style={label}>Policy Plan Start Date</label><input style={{ ...input, width: '200px' }} type="date" name="life_plan_start_date" value={form.life_plan_start_date} onChange={handleChange} /></div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div>
                <p style={sectionTitle}>Financial Profile</p>
                <div style={{ marginBottom: '12px' }}><label style={label}>Current Financial Products</label><input style={input} name="current_financial_products" value={form.current_financial_products} onChange={handleChange} placeholder="e.g. IRA, 401k, Annuity..." /></div>
                <div style={{ marginBottom: '12px' }}><label style={label}>Interested Financial Products</label><input style={input} name="interested_financial_products" value={form.interested_financial_products} onChange={handleChange} placeholder="e.g. Annuity, Roth IRA..." /></div>
                <div style={row}>
                  <div style={col}><label style={label}>Retirement Goal Age</label><input style={input} type="number" name="retirement_goal_age" value={form.retirement_goal_age} onChange={handleChange} placeholder="e.g. 65" /></div>
                  <div style={col}><label style={label}>Risk Tolerance</label><select style={select} name="risk_tolerance" value={form.risk_tolerance} onChange={handleChange}><option value="">Select...</option><option value="conservative">Conservative</option><option value="moderate">Moderate</option><option value="aggressive">Aggressive</option></select></div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <p style={sectionTitle}>Notes & Activity</p>
                <label style={label}>Notes</label>
                <textarea style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} name="notes" value={form.notes} onChange={handleChange} placeholder="Add any notes about this client..." />
              </div>
            )}

            {/* FOOTER inside form so submit works */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #eee', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#c0392b', fontSize: '13px' }}>{error}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={onClose} style={{ padding: '9px 18px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white' }}>Cancel</button>
                <button type="submit" style={{ padding: '9px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: GOLD, color: 'white', fontWeight: '600' }}>Save Client</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientForm;