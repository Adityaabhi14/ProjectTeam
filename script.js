/* =================================================================
   CarePoint Hospital Management System — Frontend Client v3.0
   Connects to MySQL / Express REST API (/api)
   Offline fallback via localStorage
   Premium 3D UI: Three.js · Chart.js · GSAP-style animations
   ================================================================= */

const API_BASE = '/api';
let useBackend = true;

/* ── Entity schema (from ER diagram) ─────────────────────────────
   Types: text tel email number date time area bool sel:A|B fk:entity
   trailing ! = required                                            */
const E = {
  patient: {
    t: 'Patients', g: 'People', pk: 'PatientID', d: r => r.FirstName + ' ' + (r.LastName || ''),
    f: [
      ['AadhaarNo', 'text'], ['FirstName', 'text!'], ['LastName', 'text'], ['DOB', 'date'],
      ['Gender', 'sel:Male|Female|Other'], ['BloodGroup', 'sel:A+|A-|B+|B-|AB+|AB-|O+|O-'],
      ['Phone', 'tel!'], ['Email', 'email'], ['Address', 'area'],
      ['EmergencyContactName', 'text'], ['EmergencyContactPhone', 'tel'], ['RegistrationDate', 'date']
    ],
    api: '/patients'
  },
  doctor: {
    t: 'Doctors', g: 'People', pk: 'DoctorID', d: r => 'Dr. ' + r.FirstName + ' ' + (r.LastName || ''),
    f: [
      ['DepartmentID', 'fk:department!'], ['FirstName', 'text!'], ['LastName', 'text!'],
      ['Gender', 'sel:Male|Female|Other'], ['Qualification', 'text'], ['Specialization', 'text'],
      ['Phone', 'tel'], ['Email', 'email'], ['ConsultationFee', 'number'], ['JoiningDate', 'date']
    ],
    api: '/doctors'
  },
  department: {
    t: 'Departments', g: 'People', pk: 'DepartmentID', d: r => r.DepartmentName,
    f: [
      ['DepartmentName', 'text!'], ['Description', 'area'], ['PhoneNo', 'tel'], ['Location', 'text']
    ],
    api: '/departments'
  },
  appointment: {
    t: 'Appointments', g: 'Clinical', pk: 'AppointmentID', d: r => '#' + r.AppointmentID + ' (' + r.AppointmentDate + ')',
    f: [
      ['PatientID', 'fk:patient!'], ['DoctorID', 'fk:doctor!'], ['AppointmentDate', 'date!'],
      ['StartTime', 'time'], ['EndTime', 'time'], ['Type', 'sel:Consultation|Follow-up|Emergency|Procedure'],
      ['Reason', 'area'], ['Status', 'sel:Scheduled|Completed|Cancelled|No-show'], ['CreatedAt', 'date']
    ],
    api: '/appointments'
  },
  medhistory: {
    t: 'Medical History', g: 'Clinical', pk: 'HistoryID', d: r => 'History #' + r.HistoryID,
    f: [
      ['PatientID', 'fk:patient!'], ['PastIllnesses', 'area'], ['PastSurgeries', 'area'],
      ['FamilyHistory', 'area'], ['ChronicConditions', 'area'], ['Allergies', 'area'],
      ['Notes', 'area'], ['CreatedAt', 'date']
    ],
    api: '/medical-histories'
  },
  insurance: {
    t: 'Insurance', g: 'Clinical', pk: 'InsuranceID', d: r => r.ProviderName + ' ' + r.PolicyNumber,
    f: [
      ['PatientID', 'fk:patient!'], ['ProviderName', 'text!'], ['PolicyNumber', 'text!'],
      ['PolicyHolderName', 'text'], ['Relationship', 'text'], ['CoverageType', 'text'],
      ['ValidFrom', 'date'], ['ValidTo', 'date']
    ],
    api: '/insurances'
  },
  prescription: {
    t: 'Prescriptions', g: 'Pharmacy', pk: 'PrescriptionID', d: r => 'Rx #' + r.PrescriptionID,
    f: [
      ['AppointmentID', 'fk:appointment!'], ['DoctorID', 'fk:doctor!'], ['Description', 'area'], ['Notes', 'area']
    ],
    api: '/prescriptions'
  },
  rxitem: {
    t: 'Prescription Items', g: 'Pharmacy', pk: 'PrescriptionItemID', d: r => 'Item #' + r.PrescriptionItemID,
    f: [
      ['PrescriptionID', 'fk:prescription!'], ['MedicineID', 'fk:medicine!'],
      ['Dose', 'text'], ['Frequency', 'text'], ['Duration', 'text'], ['Instructions', 'area']
    ],
    api: '/prescriptions/items'
  },
  medicine: {
    t: 'Medicines', g: 'Pharmacy', pk: 'MedicineID', d: r => r.MedicineName,
    f: [
      ['MedicineName', 'text!'], ['Category', 'text'], ['Description', 'area'], ['UnitPrice', 'number'], ['IsActive', 'bool']
    ],
    api: '/medicines'
  },
  service: {
    t: 'Services', g: 'Billing', pk: 'ServiceID', d: r => r.ServiceName,
    f: [
      ['ServiceName', 'text!'], ['Description', 'area'], ['Charge', 'number!'], ['IsActive', 'bool']
    ],
    api: '/services'
  },
  bill: {
    t: 'Bills', g: 'Billing', pk: 'BillID', d: r => 'Bill #' + r.BillID,
    f: [
      ['AppointmentID', 'fk:appointment'], ['PatientID', 'fk:patient!'], ['BillDate', 'date'],
      ['Subtotal', 'number'], ['Discount', 'number'], ['Tax', 'number'], ['TotalAmount', 'number'],
      ['Status', 'sel:Unpaid|Partially Paid|Paid|Cancelled'], ['Notes', 'area']
    ],
    api: '/bills'
  },
  billitem: {
    t: 'Bill Items', g: 'Billing', pk: 'BillItemID', d: r => 'Bill item #' + r.BillItemID,
    f: [
      ['BillID', 'fk:bill!'], ['ServiceID', 'fk:service'], ['Description', 'text'],
      ['Quantity', 'number!'], ['UnitPrice', 'number!'], ['Amount', 'number']
    ],
    api: '/bill-items'
  },
  payment: {
    t: 'Payments', g: 'Billing', pk: 'PaymentID', d: r => 'Payment #' + r.PaymentID,
    f: [
      ['BillID', 'fk:bill!'], ['PaymentDate', 'date'],
      ['PaymentMethod', 'sel:Cash|Card|UPI|Net banking|Insurance'],
      ['AmountPaid', 'number!'], ['ReferenceNo', 'text'],
      ['Status', 'sel:Completed|Pending|Failed|Refunded'], ['Notes', 'area']
    ],
    api: '/payments'
  },
  floorward: {
    t: 'Floors / Wards', g: 'Facilities', pk: 'FloorWardID', d: r => r.FloorWardName,
    f: [
      ['FloorWardName', 'text!'], ['Description', 'area']
    ],
    api: '/floor-wards'
  },
  room: {
    t: 'Rooms', g: 'Facilities', pk: 'RoomID', d: r => 'Room ' + r.RoomNumber,
    f: [
      ['FloorWardID', 'fk:floorward!'], ['RoomNumber', 'text!'],
      ['RoomType', 'sel:General|Semi-private|Private|ICU|Operation theatre'],
      ['BedCount', 'number'], ['OccupancyStatus', 'sel:Available|Occupied|Maintenance'],
      ['ChargePerDay', 'number'], ['Status', 'sel:Active|Inactive'], ['Notes', 'area']
    ],
    api: '/rooms'
  }
};

/* ── Helpers ──────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const today = () => new Date().toISOString().slice(0, 10);
const num = v => parseFloat(v) || 0;
const lab = n => n.replace(/ID$/, ' ID').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
const parse = s => {
  const req = s.endsWith('!');
  const [ty, x] = s.replace('!', '').split(':');
  return { ty, x, req };
};
const DEF = ['RegistrationDate', 'AppointmentDate', 'BillDate', 'PaymentDate', 'CreatedAt'];

/* ── In-memory cache + localStorage fallback ──────────────────── */
let db = null;
try { db = JSON.parse(localStorage.getItem('hms')); } catch (e) {}
if (!db) {
  db = { seq: {} };
  Object.keys(E).forEach(k => db[k] = []);
  seed();
}

const save = () => { try { localStorage.setItem('hms', JSON.stringify(db)); } catch (e) {} };
function add(k, o) {
  db.seq[k] = (db.seq[k] || 0) + 1;
  o[E[k].pk] = db.seq[k];
  db[k].push(o);
  return o;
}

function seed() {
  add('department', { DepartmentName: 'Cardiology', Description: 'Heart checks, ECG and cardiac care.', PhoneNo: '040-111111', Location: 'Block A, 1st Floor' });
  add('department', { DepartmentName: 'Pediatrics', Description: 'Care for infants, children and teens.', PhoneNo: '040-222222', Location: 'Block B, Ground Floor' });
  add('department', { DepartmentName: 'Orthopedics', Description: 'Bone, joint and sports injury treatment.', PhoneNo: '040-333333', Location: 'Block C, 2nd Floor' });
  add('doctor', { DepartmentID: 1, FirstName: 'Ananya', LastName: 'Rao', Gender: 'Female', Qualification: 'MD, DM', Specialization: 'Cardiologist', Phone: '9000000001', ConsultationFee: 600, JoiningDate: '2020-01-10' });
  add('doctor', { DepartmentID: 2, FirstName: 'Sameer', LastName: 'Khan', Gender: 'Male', Qualification: 'MD', Specialization: 'Pediatrician', Phone: '9000000002', ConsultationFee: 450, JoiningDate: '2021-03-05' });
  add('doctor', { DepartmentID: 3, FirstName: 'Manish', LastName: 'Reddy', Gender: 'Male', Qualification: 'MS Ortho', Specialization: 'Orthopedic Surgeon', Phone: '9000000003', ConsultationFee: 700, JoiningDate: '2019-07-20' });
  add('patient', { AadhaarNo: '1111 2222 3333', FirstName: 'Ravi', LastName: 'Kumar', DOB: '1985-04-12', Gender: 'Male', BloodGroup: 'O+', Phone: '9111111111', RegistrationDate: today() });
  add('appointment', { PatientID: 1, DoctorID: 1, AppointmentDate: today(), StartTime: '10:00', EndTime: '10:30', Type: 'Consultation', Reason: 'Chest pain check', Status: 'Scheduled', CreatedAt: today() });
  add('medicine', { MedicineName: 'Paracetamol 500mg', Category: 'Analgesic', UnitPrice: 2.5, IsActive: true });
  add('service', { ServiceName: 'Doctor Consultation', Charge: 500, IsActive: true });
  add('service', { ServiceName: 'ECG', Charge: 350, IsActive: true });
  add('floorward', { FloorWardName: 'Ground Floor - OPD', Description: 'Outpatient wing and triage desk.' });
  add('room', { FloorWardID: 1, RoomNumber: '101', RoomType: 'General', BedCount: 6, OccupancyStatus: 'Available', ChargePerDay: 800, Status: 'Active' });
}

/* ── JWT auth token ───────────────────────────────────────────── */
let authToken = localStorage.getItem('cp_token') || '';

function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (authToken) h['Authorization'] = 'Bearer ' + authToken;
  return h;
}

/* ── Sync live data from backend API ─────────────────────────── */
async function syncFromBackend() {
  try {
    const health = await fetch(`${API_BASE}/health`).then(r => r.json());
    if (health && health.status === 'online') {
      useBackend = true;
      const endpoints = {
        patient: '/patients', doctor: '/doctors', department: '/departments',
        appointment: '/appointments', medhistory: '/medical-histories',
        insurance: '/insurances', prescription: '/prescriptions',
        medicine: '/medicines', service: '/services', bill: '/bills',
        payment: '/payments', floorward: '/floor-wards', room: '/rooms'
      };
      for (const [key, ep] of Object.entries(endpoints)) {
        try {
          const res = await fetch(`${API_BASE}${ep}`, { headers: authHeaders() }).then(r => r.json());
          if (res && res.success && Array.isArray(res.data)) db[key] = res.data;
        } catch (e) {}
      }
      save();
      site();
      if (portalOn) view();
    }
  } catch (err) {
    useBackend = false;
  }
}

const row = (k, id) => db[k].find(r => r[E[k].pk] == id);
const ref = (k, id) => { const r = row(k, id); return r ? E[k].d(r) : (id || ''); };

/* ================================================================
   PUBLIC WEBSITE
   ================================================================ */
let portalOn = false, cur = 'dash', q = '', editing = null;

function show(w) {
  portalOn = w === 'portal';
  $('site').hidden = w !== 'site';
  $('profile').hidden = w !== 'profile';
  $('portal').hidden = !portalOn;
  $('plinks').hidden = w !== 'site';
  $('pfbtn').hidden = w !== 'site';
  $('swbtn').textContent = w === 'site' ? 'Staff Portal →' : '← Back to Website';
  window.scrollTo(0, 0);
  if (portalOn) { side(); view(); } else if (w === 'profile') prof(); else site();
}

function site() {
  const beds = db.room.reduce((s, r) => s + num(r.BedCount), 0);
  $('stats').innerHTML = [
    [db.doctor.length, 'Expert Doctors'],
    [db.department.length, 'Departments'],
    [beds, 'Total Beds'],
    ['24/7', 'Emergency Care']
  ].map(x => `<div class="stat"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');

  $('sdept').innerHTML = db.department.map(d =>
    `<div class="c"><h3>${d.DepartmentName}</h3><p>${d.Description || ''}</p><span class="tag">📍 ${d.Location || ''}</span></div>`
  ).join('');

  $('sdoc').innerHTML = db.doctor.map(d =>
    `<div class="c">
       <div class="av">${d.FirstName[0]}${d.LastName ? d.LastName[0] : ''}</div>
       <h3>${E.doctor.d(d)}</h3>
       <p>${d.Specialization || ''} · ${ref('department', d.DepartmentID)}</p>
       <span class="tag">₹${d.ConsultationFee || 0} / consult</span><br>
       <button class="btn sm" style="margin-top:12px" onclick="dprof(${d.DoctorID})">View profile →</button>
     </div>`
  ).join('');

  $('b_doc').innerHTML = '<option value="">Select doctor</option>' + db.doctor.map(d =>
    `<option value="${d.DoctorID}">${E.doctor.d(d)} (${ref('department', d.DepartmentID)})</option>`
  ).join('');

  $('b_date').min = today();

  // Animate stat counters
  requestAnimationFrame(() => {
    document.querySelectorAll('.stat b').forEach(el => {
      el.style.animation = 'slideUp .4s cubic-bezier(.16,1,.3,1) both';
    });
  });
}

async function book(ev) {
  ev.preventDefault();
  const f = ev.target, v = n => f[n].value.trim();
  try {
    if (useBackend) {
      const res = await fetch(`${API_BASE}/appointments/book`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          name: v('name'), phone: v('phone'),
          doctorId: +v('doctor'), date: v('date'), reason: v('reason')
        })
      }).then(r => r.json());
      if (res && res.success) {
        f.reset();
        $('bmsg').textContent = res.message;
        showToast('Appointment requested!', 'ok');
        syncFromBackend();
        return;
      }
    }
  } catch (e) {}
  // Offline fallback
  let p = db.patient.find(x => x.Phone == v('phone'));
  if (!p) {
    const nm = v('name').split(/\s+/);
    p = add('patient', { FirstName: nm[0], LastName: nm.slice(1).join(' '), Phone: v('phone'), RegistrationDate: today() });
  }
  const a = add('appointment', {
    PatientID: p.PatientID, DoctorID: +v('doctor'),
    AppointmentDate: v('date'), Type: 'Consultation',
    Reason: v('reason'), Status: 'Scheduled', CreatedAt: today()
  });
  save();
  f.reset();
  $('bmsg').textContent = 'Appointment #' + a.AppointmentID + ' requested. We will call you to confirm.';
  showToast('Appointment #' + a.AppointmentID + ' created!', 'ok');
}

/* ================================================================
   STAFF PORTAL — Sidebar
   ================================================================ */

/* Module icons */
const ICONS = {
  dash: '⚡', patient: '👤', doctor: '🩺', department: '🏥',
  appointment: '📅', medhistory: '📋', insurance: '🛡️',
  prescription: '💊', rxitem: '📝', medicine: '🧪',
  service: '⚙️', bill: '🧾', billitem: '📦', payment: '💳',
  floorward: '🏢', room: '🛏️'
};

function side() {
  let h = `<button class="${cur === 'dash' ? 'on' : ''}" onclick="go('dash')">
             <span style="font-size:1rem" aria-hidden="true">${ICONS.dash}</span> Dashboard
           </button>`;
  let g = '';
  for (const k in E) {
    if (E[k].g !== g) {
      g = E[k].g;
      h += `<small>${g}</small>`;
    }
    h += `<button class="${cur === k ? 'on' : ''}" onclick="go('${k}')">
            <span style="font-size:.95rem" aria-hidden="true">${ICONS[k] || '•'}</span> ${E[k].t}
          </button>`;
  }
  $('side').innerHTML = h;
}

function go(k) {
  cur = k;
  q = '';
  side();
  view();
}

function cell(c, r) {
  const f = E[cur].f.find(x => x[0] === c);
  if (!f) return r[c];
  const p = parse(f[1]), v = r[c];
  return p.ty === 'fk' ? ref(p.x, v) : p.ty === 'bool' ? (v ? 'Yes' : 'No') : (v == null ? '' : v);
}

function view() {
  if (cur === 'dash') return dash();
  const e = E[cur], cols = [e.pk, ...e.f.map(f => f[0])];
  const rows = db[cur].filter(r => !q || JSON.stringify(cols.map(c => cell(c, r))).toLowerCase().includes(q));
  let h = `<h2>${ICONS[cur] || ''} ${e.t}</h2>
    <div class="bar">
      <input id="q" placeholder="Search ${e.t.toLowerCase()}…" value="${q}" aria-label="Search"
             oninput="q=this.value.toLowerCase();view();var i=$('q');i.focus();i.setSelectionRange(99,99)">
      <button class="btn" onclick="edit()">+ Add new</button>
    </div>`;
  h += `<div class="scroll"><table><thead><tr>` +
       cols.map(c => `<th>${lab(c)}</th>`).join('') +
       `<th>Actions</th></tr></thead><tbody>`;
  if (rows.length) {
    h += rows.map(r =>
      `<tr>${cols.map(c => `<td title="${cell(c,r)}">${cell(c, r)}</td>`).join('')}
       <td class="act">${xa(r)}<button class="btn sm grey" onclick="edit(${r[e.pk]})">Edit</button>
       <button class="btn sm del" onclick="del(${r[e.pk]})">Delete</button></td></tr>`
    ).join('');
  }
  h += `</tbody></table>`;
  if (!rows.length) h += `<div class="empty">🔍 No ${e.t.toLowerCase()} found. Click <b>+ Add new</b> to create one.</div>`;
  $('main').innerHTML = h + `</div>`;

  // Re-apply card tilt to newly rendered elements
  requestAnimationFrame(applyCardTilt);
}

/* ================================================================
   DASHBOARD  — premium version with hero strip + charts
   ================================================================ */
function dash() {
  const paid = db.payment.filter(p => p.Status === 'Completed').reduce((s, p) => s + num(p.AmountPaid), 0);
  const todayAppts = db.appointment.filter(a => a.AppointmentDate === today()).length;
  const availRooms = db.room.filter(r => r.OccupancyStatus === 'Available').length;

  const cards = [
    ['Patients', db.patient.length, 'patient'],
    ['Doctors', db.doctor.length, 'doctor'],
    ['Departments', db.department.length, 'department'],
    ['Today\'s Appointments', todayAppts, 'appointment'],
    ['Unpaid Bills', db.bill.filter(b => b.Status !== 'Paid' && b.Status !== 'Cancelled').length, 'bill'],
    ['Revenue Collected', '₹' + paid.toLocaleString('en-IN'), 'payment'],
    ['Available Rooms', availRooms, 'room'],
    ['Medicines', db.medicine.length, 'medicine']
  ];

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';

  // Recent activity from appointments
  const recentAppts = [...db.appointment]
    .sort((a, b) => String(b.CreatedAt).localeCompare(String(a.CreatedAt)))
    .slice(0, 6);

  const activityItems = recentAppts.length
    ? recentAppts.map(a => {
        const dot = a.Status === 'Scheduled' ? 'c' : a.Status === 'Completed' ? 's' : 'w';
        const patient = ref('patient', a.PatientID);
        const doctor  = ref('doctor', a.DoctorID);
        return `<li class="activity-item">
          <span class="activity-dot ${dot}" aria-hidden="true"></span>
          <span class="activity-text">
            Appointment <b>#${a.AppointmentID}</b> — ${patient} with ${doctor}
            <span style="margin-left:6px;font-size:.75rem;background:var(--cyan-dim);color:var(--cyan);
                         padding:1px 8px;border-radius:99px">${a.Status}</span>
          </span>
          <span class="activity-time">${a.AppointmentDate}</span>
        </li>`;
      }).join('')
    : `<li class="activity-item"><span class="activity-text" style="color:var(--t3)">No activity yet.</span></li>`;

  $('main').innerHTML = `
    <!-- Hero strip -->
    <div class="dash-hero">
      <div>
        <div class="dash-greeting">${greet}, Staff</div>
        <div class="dash-title">Hospital Command Center</div>
        <div class="dash-subtitle">Here's what's happening at CarePoint right now.</div>
      </div>
      <canvas id="dash-3d-canvas" aria-hidden="true"
              style="width:190px;height:190px;border-radius:50%;flex-shrink:0;
                     border:1px solid var(--glass-border)"></canvas>
    </div>

    <!-- Stat cards -->
    <p class="note">
      Typical flow: add a patient → book an appointment → write a prescription → create a bill → record payment.
      Public appointment requests appear under Appointments automatically.
    </p>
    <div class="cards">
      ${cards.map(x => `
        <div class="card" onclick="go('${x[2]}')" role="button" tabindex="0"
             aria-label="${x[0]}: ${x[1]}">
          <b>${x[1]}</b><span>${x[0]}</span>
        </div>`).join('')}
    </div>

    <!-- Charts row -->
    <div class="charts-grid">
      <div class="chart-card">
        <h4>📈 Appointment Trends (Last 7 Days)</h4>
        <canvas id="chart-trend" aria-label="Appointment trends chart"></canvas>
      </div>
      <div class="chart-card">
        <h4>🏥 Department Distribution</h4>
        <canvas id="chart-dept" aria-label="Department distribution chart"></canvas>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="chart-card" style="margin-top:var(--s5)">
      <h4>🕐 Recent Activity</h4>
      <ul class="activity-list">${activityItems}</ul>
    </div>`;

  // Initialize 3D DNA scene + charts after DOM is painted
  requestAnimationFrame(() => {
    initDNAScene();
    initDashCharts();
    applyCardTilt();
    animateCounters();
  });
}

/* ================================================================
   ER RELATIONSHIPS — Quick-action buttons on table rows
   ================================================================ */
const X = {
  doctor: [['Profile', 'dp']],
  patient: [['Full record', 'rec']],
  appointment: [['Prescribe', 'prescription'], ['Create bill', 'bill']],
  prescription: [['Add medicine', 'rxitem']],
  bill: [['Add item', 'billitem'], ['Pay', 'payment']],
  floorward: [['Add room', 'room']]
};

function xa(r) {
  return (X[cur] || []).map(x =>
    `<button class="btn sm" onclick="rel('${x[1]}',${r[E[cur].pk]})">${x[0]}</button>`
  ).join('');
}

function rel(t, id) {
  const s = cur, r = row(s, id);
  if (t === 'rec') return rec(id);
  if (t === 'dp') return dprof(id);
  let p = {};
  if (s === 'appointment') p = t === 'bill' ? { AppointmentID: id, PatientID: r.PatientID } : { AppointmentID: id, DoctorID: r.DoctorID };
  if (s === 'prescription') p = { PrescriptionID: id };
  if (s === 'bill') p = t === 'payment' ? { BillID: id, AmountPaid: r.TotalAmount } : { BillID: id };
  if (s === 'floorward') p = { FloorWardID: id };
  cur = t;
  side();
  view();
  edit(null, p);
}

/* ================================================================
   PATIENT & DOCTOR PROFILES
   ================================================================ */
let pid = null;

async function plook(ev) {
  ev.preventDefault();
  const v = n => $(n).value.trim();
  let p = db.patient.find(x => x.Phone === v('pp'));
  if (!p) {
    if (!v('pn')) {
      $('pmsg').textContent = 'No profile found for this number. Enter your name to create one.';
      return;
    }
    const nm = v('pn').split(/\s+/);
    p = add('patient', { FirstName: nm[0], LastName: nm.slice(1).join(' '), Email: v('pe'), Phone: v('pp'), RegistrationDate: today() });
    save();
  }
  pid = p.PatientID;
  prof();
}

function prof() {
  const p = pid && row('patient', pid);
  if (!p) {
    pid = null;
    $('pbody').innerHTML = `
      <h2>My Profile</h2>
      <p class="sub">Enter your phone number to access your patient record. If you are not registered yet, provide your name too and we will create a profile for you.</p>
      <form class="book" style="max-width:400px" onsubmit="plook(event)" novalidate>
        <label for="pn">Full name</label><input id="pn" autocomplete="name" placeholder="Your full name">
        <label for="pe">Email</label><input id="pe" type="email" autocomplete="email" placeholder="you@example.com">
        <label for="pp">Phone number *</label><input id="pp" type="tel" required autocomplete="tel" placeholder="+91 90000 00000">
        <button class="btn" style="margin-top:12px;width:100%">Open or Create Profile →</button>
        <p id="pmsg" role="status" style="margin-top:8px;color:var(--err);font-weight:600"></p>
      </form>`;
    return;
  }
  const age = p.DOB ? Math.floor((Date.now() - new Date(p.DOB)) / 31557600000) : '';
  const mine = k => db[k].filter(x => x.PatientID == pid);
  const ap = mine('appointment').sort((a, b) => String(b.AppointmentDate).localeCompare(String(a.AppointmentDate)));
  const ids = ap.map(a => a.AppointmentID);

  const S = (t, a, fn) => `<div class="ps"><h3>${t}</h3>` +
    (a.length ? `<ul style="margin:6px 0 0 20px">${a.map(x => `<li style="padding:4px 0;color:var(--t2);font-size:.875rem">${fn(x)}</li>`).join('')}</ul>` :
      `<p class="note" style="margin:0">Nothing recorded yet.</p>`) + `</div>`;

  const kv = [
    ['Patient ID', p.PatientID], ['Gender', p.Gender], ['Age', age ? age + ' years' : ''],
    ['Date of birth', p.DOB], ['Blood group', p.BloodGroup], ['Address', p.Address],
    ['Aadhaar No.', p.AadhaarNo],
    ['Emergency contact', [p.EmergencyContactName, p.EmergencyContactPhone].filter(Boolean).join(' — ')],
    ['Registered', p.RegistrationDate]
  ].filter(x => x[1] !== '' && x[1] != null);

  $('pbody').innerHTML =
    `<div class="ps" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
       <div class="av" style="width:70px;height:70px;margin:0;font-size:1.4rem">
         ${p.FirstName[0]}${p.LastName ? p.LastName[0] : ''}
       </div>
       <div style="flex:1;min-width:160px">
         <h2 style="margin:0">${E.patient.d(p)}</h2>
         <p style="margin:2px 0 0;font-size:.85rem">Patient ID&nbsp;${p.PatientID}</p>
       </div>
       <button class="btn" onclick="cur='patient';edit(pid)">Edit Details</button>
       <button class="btn grey" onclick="pid=null;prof()">Switch Patient</button>
     </div>

     <form class="ps" onsubmit="psave(event)" novalidate>
       <h3>Name, Email & Phone</h3>
       <div class="fg">
         ${[['pf1','First name',p.FirstName,'text'],['pf2','Last name',p.LastName,'text'],
            ['pf3','Email',p.Email,'email'],['pf4','Phone',p.Phone,'tel']]
           .map(f => `<div><label for="${f[0]}">${f[1]}</label>
             <input id="${f[0]}" type="${f[3]}" value="${String(f[2]||'').replace(/"/g,'&quot;')}"
                    ${f[0]==='pf3'?'':'required'}></div>`).join('')}
       </div>
       <div class="ft" style="align-items:center">
         <span id="pfm" role="status" style="font-weight:600;color:var(--ok)"></span>
         <button class="btn">Save Changes</button>
       </div>
     </form>

     <div class="ps"><h3>Personal Details</h3>
       <div class="kv">${kv.map(x => `<p><b>${x[0]}:</b> ${x[1]}</p>`).join('')}</div>
     </div>`

    + S('Medical History', mine('medhistory'), x =>
        'Allergies: ' + (x.Allergies || 'none noted') +
        '; Chronic: ' + (x.ChronicConditions || 'none noted') +
        (x.PastSurgeries ? '; Surgeries: ' + x.PastSurgeries : ''))
    + S('Insurance', mine('insurance'), x =>
        x.ProviderName + ', policy ' + x.PolicyNumber +
        (x.CoverageType ? ' (' + x.CoverageType + ')' : '') +
        ', valid to ' + (x.ValidTo || '—'))
    + S('Appointments', ap, x =>
        x.AppointmentDate + ' ' + (x.StartTime || '') + ' with ' + ref('doctor', x.DoctorID) +
        ' — ' + x.Status + (x.Reason ? ' (' + x.Reason + ')' : ''))
    + S('Prescriptions', db.prescription.filter(r => ids.includes(r.AppointmentID)), r => {
        const it = (r.items || db.rxitem.filter(i => i.PrescriptionID == r.PrescriptionID))
          .map(i => ref('medicine', i.MedicineID) + ' ' + [i.Dose, i.Frequency, i.Duration].filter(Boolean).join(' '));
        return 'Rx #' + r.PrescriptionID + ' by ' + ref('doctor', r.DoctorID) +
               ': ' + (it.length ? it.join(', ') : 'no medicines listed');
      })
    + S('Bills', mine('bill'), b => {
        const pd = db.payment.filter(y => y.BillID == b.BillID && y.Status === 'Completed')
          .reduce((s, y) => s + num(y.AmountPaid), 0);
        return 'Bill #' + b.BillID + ' (' + (b.BillDate || '') + '): Total ₹' + (b.TotalAmount || 0) +
               ', Paid ₹' + pd + ' — ' + b.Status;
      });
}

function psave(ev) {
  ev.preventDefault();
  const p = row('patient', pid), v = n => $(n).value.trim(), ph = v('pf4');
  if (db.patient.some(x => x.PatientID != pid && x.Phone === ph)) {
    $('pfm').style.color = 'var(--err)';
    $('pfm').textContent = 'This phone number belongs to another patient.';
    return;
  }
  p.FirstName = v('pf1'); p.LastName = v('pf2'); p.Email = v('pf3'); p.Phone = ph;
  save();
  prof();
  $('pfm').textContent = '✓ Saved successfully.';
  showToast('Profile updated.', 'ok');
}

function dprof(id) {
  const d = row('doctor', id);
  const R = (a, b) => b ? `<p style="padding:4px 0;font-size:.875rem"><b style="color:var(--t2)">${a}:</b> ${b}</p>` : '';
  $('frm').innerHTML =
    `<div class="av" style="width:64px;height:64px;font-size:1.25rem;margin-bottom:var(--s4)">
       ${d.FirstName[0]}${d.LastName ? d.LastName[0] : ''}
     </div>
     <h3>${E.doctor.d(d)}</h3>
     <p class="note" style="margin-bottom:var(--s4)">${d.Specialization || 'General Physician'}</p>
     ${R('Department', ref('department', d.DepartmentID))}
     ${R('Qualification', d.Qualification)}
     ${R('Consultation Fee', '₹' + (d.ConsultationFee || 0))}
     ${R('Joined', d.JoiningDate)}
     ${R('Gender', d.Gender)}
     ${R('Phone', d.Phone)}
     ${R('Email', d.Email)}
     ${R('Upcoming Appointments', String(db.appointment.filter(a => a.DoctorID == id && a.Status === 'Scheduled').length))}
     <div class="ft">
       <button type="button" class="btn grey" onclick="$('dlg').close()">Close</button>
       ${portalOn ? '' : `<button type="button" class="btn" onclick="$('b_doc').value=${id};$('dlg').close();document.getElementById('book').scrollIntoView()">Book this doctor</button>`}
     </div>`;
  $('dlg').showModal();
}

function rec(id) {
  const p = row('patient', id);
  const L = (k, fn) => {
    const a = db[k].filter(x => x.PatientID == id);
    return a.length
      ? `<ul style="margin:4px 0 12px 20px">${a.map(x => `<li style="padding:3px 0;color:var(--t2);font-size:.875rem">${fn(x)}</li>`).join('')}</ul>`
      : `<p class="note">None yet.</p>`;
  };
  $('frm').innerHTML =
    `<h3>${E.patient.d(p)}</h3>
     <p class="note">${[p.Gender, p.BloodGroup, 'DOB ' + (p.DOB||'—'), p.Phone].filter(Boolean).join(', ')}</p>
     <h3>Medical History</h3>${L('medhistory', x => 'Allergies: ' + (x.Allergies||'—') + '; Chronic: ' + (x.ChronicConditions||'—'))}
     <h3>Insurance</h3>${L('insurance', x => x.ProviderName + ' ' + x.PolicyNumber + ' (valid to ' + (x.ValidTo||'—') + ')')}
     <h3>Appointments</h3>${L('appointment', x => x.AppointmentDate + ' with ' + ref('doctor',x.DoctorID) + ' — ' + x.Status)}
     <h3>Bills</h3>${L('bill', x => 'Bill #' + x.BillID + ', ₹' + x.TotalAmount + ' — ' + x.Status)}
     <div class="ft"><button type="button" class="btn grey" onclick="$('dlg').close()">Close</button></div>`;
  $('dlg').showModal();
}

function edit(id, pre) {
  const e = E[cur];
  editing = id ? row(cur, id) : null;
  const r = editing || pre || {};
  let h = `<h3>${id ? 'Edit' : 'Add'} ${e.t}</h3><div class="fg">`;
  e.f.forEach(([n, t]) => {
    const p = parse(t);
    let v = r[n];
    if (v == null && DEF.includes(n)) v = today();
    if (v == null && p.ty === 'bool') v = true;
    const rq = p.req ? ' required' : '', a = ` id="f_${n}" name="${n}"`;
    let inp;
    if (p.ty === 'area')  inp = `<textarea${a}${rq} rows="2">${v || ''}</textarea>`;
    else if (p.ty === 'bool') inp = `<input type="checkbox"${a}${v ? ' checked' : ''} style="width:auto">`;
    else if (p.ty === 'sel') inp = `<select${a}${rq}><option value="">Select</option>` +
      p.x.split('|').map(o => `<option${o===v?' selected':''}>${o}</option>`).join('') + `</select>`;
    else if (p.ty === 'fk') inp = `<select${a}${rq}><option value="">Select</option>` +
      db[p.x].map(o => `<option value="${o[E[p.x].pk]}"${o[E[p.x].pk]==v?' selected':''}>${E[p.x].d(o)}</option>`).join('') + `</select>`;
    else inp = `<input type="${p.ty==='number'?'number" step="0.01':p.ty}"${a}${rq} value="${v==null?'':String(v).replace(/"/g,'&quot;')}">`;
    h += `<div class="${p.ty==='area'?'full':''}"><label for="f_${n}">${lab(n)}${p.req?' *':''}</label>${inp}</div>`;
  });
  $('frm').innerHTML = h + `</div><div class="ft">
    <button type="button" class="btn grey" onclick="$('dlg').close()">Cancel</button>
    <button class="btn" type="submit">Save</button>
  </div>`;
  $('dlg').showModal();
}

$('frm').onsubmit = async ev => {
  ev.preventDefault();
  const e = E[cur], o = {};
  e.f.forEach(([n, t]) => {
    const p = parse(t), el = $('f_' + n);
    o[n] = p.ty === 'bool' ? el.checked
          : p.ty === 'number' ? (el.value === '' ? '' : num(el.value))
          : p.ty === 'fk' ? (el.value ? +el.value : '')
          : el.value;
  });

  if (useBackend) {
    try {
      const ep = e.api;
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API_BASE}${ep}/${editing[e.pk]}` : `${API_BASE}${ep}`;
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(o) }).then(r => r.json());
      if (res && res.success) {
        showToast((editing ? 'Updated' : 'Created') + ' successfully!', 'ok');
        $('dlg').close();
        await syncFromBackend();
        if (portalOn) view();
        return;
      }
    } catch (err) {}
  }

  let rec2;
  if (editing) { Object.assign(editing, o); rec2 = editing; }
  else { rec2 = add(cur, o); }
  after(cur, rec2);
  save();
  $('dlg').close();
  showToast((editing ? 'Updated' : 'Created') + ' successfully!', 'ok');
  portalOn ? view() : (prof(), site());
};

$('frm').oninput = $('frm').onchange = ev => {
  const g = n => $('f_' + n) ? num($('f_' + n).value) : 0;
  const s = (n, v) => { if ($('f_' + n)) $('f_' + n).value = v; };
  if (cur === 'billitem') {
    if (ev.target.id === 'f_ServiceID') {
      const sv = row('service', ev.target.value);
      if (sv) { s('Description', sv.ServiceName); s('UnitPrice', sv.Charge); if (!g('Quantity')) s('Quantity', 1); }
    }
    s('Amount', +(g('Quantity') * g('UnitPrice')).toFixed(2));
  }
  if (cur === 'bill') {
    s('TotalAmount', +(g('Subtotal') - g('Discount') + g('Tax')).toFixed(2));
    if (ev.target.id === 'f_AppointmentID') {
      const a = row('appointment', ev.target.value);
      if (a) s('PatientID', a.PatientID);
    }
  }
  if (cur === 'payment' && ev.target.id === 'f_BillID' && !g('AmountPaid')) {
    const b = row('bill', ev.target.value);
    if (b) s('AmountPaid', b.TotalAmount);
  }
};

/* Business rules — bill totals follow bill items; status follows payments */
function after(k, r) {
  if (k === 'billitem') { r.Amount = +(num(r.Quantity) * num(r.UnitPrice)).toFixed(2); recalc(r.BillID); }
  if (k === 'bill') recalc(r.BillID);
  if (k === 'payment') pay(r.BillID);
}
function recalc(id) {
  const b = row('bill', id); if (!b) return;
  const it = db.billitem.filter(i => i.BillID == id);
  if (it.length) b.Subtotal = +it.reduce((s, i) => s + num(i.Amount), 0).toFixed(2);
  b.TotalAmount = +(num(b.Subtotal) - num(b.Discount) + num(b.Tax)).toFixed(2);
  pay(id);
}
function pay(id) {
  const b = row('bill', id); if (!b || b.Status === 'Cancelled') return;
  const p = db.payment.filter(x => x.BillID == id && x.Status === 'Completed').reduce((s, x) => s + num(x.AmountPaid), 0);
  b.Status = p <= 0 ? 'Unpaid' : p >= num(b.TotalAmount) ? 'Paid' : 'Partially Paid';
}

function del(id) {
  const e = E[cur];
  for (const k in E) {
    for (const f of E[k].f) {
      const p = parse(f[1]);
      if (p.ty === 'fk' && p.x === cur && db[k].some(r => r[f[0]] == id)) {
        showToast('Cannot delete: record is used in ' + E[k].t + '. Remove those first.', 'err');
        return;
      }
    }
  }
  if (!confirm('Delete this record?')) return;
  const r = row(cur, id);
  db[cur] = db[cur].filter(x => x[e.pk] != id);
  if (cur === 'billitem') recalc(r.BillID);
  if (cur === 'payment') pay(r.BillID);
  save();
  showToast('Record deleted.', 'info');
  view();
}

/* ================================================================
   LOGIN SCREEN LOGIC
   ================================================================ */
async function handleLogin(ev) {
  ev.preventDefault();
  const btn = $('login-btn'), txt = $('login-btn-text');
  const errEl = $('login-err');
  errEl.style.display = 'none';
  btn.disabled = true;
  txt.textContent = 'Signing in…';

  const username = $('l-user').value.trim();
  const password = $('l-pass').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(r => r.json());

    if (res && res.success && res.data && res.data.token) {
      authToken = res.data.token;
      localStorage.setItem('cp_token', authToken);
      launchApp();
      return;
    }
    errEl.textContent = (res && res.message) || 'Invalid credentials. Please try again.';
    errEl.style.display = 'block';
  } catch (e) {
    // Backend unreachable — fall through to demo mode
    errEl.textContent = 'Backend unreachable. Use Demo Mode below.';
    errEl.style.display = 'block';
  }
  btn.disabled = false;
  txt.textContent = 'Sign In →';
}

function demoLogin() {
  authToken = '';
  launchApp();
}

function launchApp() {
  const screen = $('login-screen');
  screen.style.opacity = '0';
  screen.style.transition = 'opacity .4s ease';
  setTimeout(() => { screen.style.display = 'none'; }, 420);
  site();
  syncFromBackend();
  showToast('Welcome to CarePoint!', 'ok');
}

/* ================================================================
   TOAST NOTIFICATIONS
   ================================================================ */
function showToast(msg, type = 'info') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'ok' ? '✓' : type === 'err' ? '✕' : 'ℹ'}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'opacity .3s,transform .3s';
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/* ================================================================
   GLOBAL SEARCH OVERLAY  (Ctrl+K)
   ================================================================ */
function openSearch() {
  $('search-overlay').hidden = false;
  setTimeout(() => $('search-input').focus(), 60);
}
function closeSearch() {
  $('search-overlay').hidden = true;
  $('search-input').value = '';
  $('search-results').innerHTML = '';
}

function handleGlobalSearch(val) {
  const q2 = val.trim().toLowerCase();
  const el = $('search-results');
  if (!q2) { el.innerHTML = ''; return; }

  const results = [];
  const add2 = (icon, label, action, sub) =>
    results.push({ icon, label, sub, action });

  db.patient.filter(p => (E.patient.d(p) + p.Phone).toLowerCase().includes(q2))
    .slice(0, 4).forEach(p => add2('👤', E.patient.d(p), () => { closeSearch(); show('portal'); cur='patient'; view(); }, 'Patient'));
  db.doctor.filter(d => E.doctor.d(d).toLowerCase().includes(q2))
    .slice(0, 3).forEach(d => add2('🩺', E.doctor.d(d), () => { closeSearch(); show('portal'); cur='doctor'; view(); }, 'Doctor'));
  db.department.filter(d => d.DepartmentName.toLowerCase().includes(q2))
    .slice(0, 2).forEach(d => add2('🏥', d.DepartmentName, () => { closeSearch(); show('portal'); cur='department'; view(); }, 'Department'));
  db.appointment.filter(a => (String(a.AppointmentDate)+a.Status).toLowerCase().includes(q2))
    .slice(0, 3).forEach(a => add2('📅', '#' + a.AppointmentID + ' — ' + a.AppointmentDate + ' · ' + a.Status,
      () => { closeSearch(); show('portal'); cur='appointment'; view(); }, 'Appointment'));

  el.innerHTML = results.length
    ? results.map(r => `<div class="search-result" onclick="(${r.action.toString()})()">
        <span style="font-size:1.1rem">${r.icon}</span>
        <div><div style="color:var(--t1);font-weight:500">${r.label}</div>
        <div style="font-size:.72rem;color:var(--t3)">${r.sub}</div></div>
      </div>`).join('')
    : `<div class="search-result" style="color:var(--t3);cursor:default">No results for "${val}"</div>`;
}

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeSearch();
});

/* ================================================================
   3-D VISUAL LAYER  — Three.js Scenes
   ================================================================ */

/* ── Login canvas: floating particle field + glowing cross ───── */
function initLoginScene() {
  if (typeof THREE === 'undefined') return;
  const canvas = $('login-canvas');
  if (!canvas) return;

  const W = canvas.parentElement.clientWidth || 600;
  const H = canvas.parentElement.clientHeight || 700;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
  camera.position.set(0, 0, 28);

  // Particle field
  const pCount = 220;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - .5) * 50;
    pPos[i*3+1] = (Math.random() - .5) * 50;
    pPos[i*3+2] = (Math.random() - .5) * 30;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x07cfe0, size: .12, transparent: true, opacity: .55 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Glowing medical cross
  const matCross = new THREE.MeshPhongMaterial({
    color: 0x07cfe0, emissive: 0x07cfe0, emissiveIntensity: .4,
    transparent: true, opacity: .75
  });
  const crossGroup = new THREE.Group();
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(.6, 2.4, .22), matCross);
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.4, .6, .22), matCross);
  crossGroup.add(vBar, hBar);
  crossGroup.position.set(0, 0, 0);
  scene.add(crossGroup);

  // Orbiting spheres
  const orbitMat = new THREE.MeshPhongMaterial({ color: 0x3b87f5, emissive: 0x3b87f5, emissiveIntensity: .3 });
  const orbitSph = new THREE.SphereGeometry(.12, 8, 8);
  const orbiters = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(orbitSph, orbitMat);
    const angle = (i / 6) * Math.PI * 2;
    m.userData = { angle, radius: 3.5 + Math.random() * 1.5, speed: .3 + Math.random() * .3, y: (Math.random()-.5)*2 };
    scene.add(m);
    orbiters.push(m);
  }

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, .25));
  const pl1 = new THREE.PointLight(0x07cfe0, 2, 30);
  pl1.position.set(4, 4, 6);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x8b5cf6, 1, 25);
  pl2.position.set(-4, -3, 5);
  scene.add(pl2);

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - .5) * 2;
    my = (e.clientY / window.innerHeight - .5) * 2;
  });

  let frame;
  function animate() {
    frame = requestAnimationFrame(animate);
    const t = Date.now() * .001;

    particles.rotation.y += .00025;
    particles.rotation.x += .0001;

    crossGroup.rotation.y += .006;
    crossGroup.rotation.x += (my * .4 - crossGroup.rotation.x) * .04;
    crossGroup.position.y = Math.sin(t * .6) * .3;

    orbiters.forEach(o => {
      o.userData.angle += o.userData.speed * .012;
      o.position.set(
        Math.cos(o.userData.angle) * o.userData.radius,
        o.userData.y + Math.sin(t * .4) * .4,
        Math.sin(o.userData.angle) * o.userData.radius
      );
    });

    camera.position.x += (mx * 1.5 - camera.position.x) * .04;
    camera.position.y += (-my * 1.2 - camera.position.y) * .04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Cleanup if login screen is removed
  $('login-screen')._cleanup = () => { cancelAnimationFrame(frame); renderer.dispose(); };
}

/* ── Dashboard canvas: DNA double helix ────────────────────────── */
let _dnaRenderer = null;
let _dnaFrame = null;

function initDNAScene() {
  if (typeof THREE === 'undefined') return;

  // Cleanup previous
  if (_dnaFrame) cancelAnimationFrame(_dnaFrame);
  if (_dnaRenderer) _dnaRenderer.dispose();

  const canvas = $('dash-3d-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';

  const SIZE = 190;
  const dpr = Math.min(window.devicePixelRatio, 2);
  canvas.width  = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(SIZE, SIZE, false);
  renderer.setPixelRatio(dpr);
  _dnaRenderer = renderer;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // DNA helix
  const group = new THREE.Group();
  const points = 28;
  const radius = 1.8;
  const height = 7;
  const sphGeo = new THREE.SphereGeometry(.13, 10, 10);
  const mat1 = new THREE.MeshPhongMaterial({ color: 0x07cfe0, emissive: 0x07cfe0, emissiveIntensity: .5 });
  const mat2 = new THREE.MeshPhongMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: .4 });
  const matBr = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: .22 });

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const a1 = t * Math.PI * 4;
    const a2 = a1 + Math.PI;
    const y  = (t - .5) * height;

    const x1 = Math.cos(a1) * radius, z1 = Math.sin(a1) * radius;
    const x2 = Math.cos(a2) * radius, z2 = Math.sin(a2) * radius;

    const s1 = new THREE.Mesh(sphGeo, mat1);
    s1.position.set(x1, y, z1);
    group.add(s1);

    const s2 = new THREE.Mesh(sphGeo, mat2);
    s2.position.set(x2, y, z2);
    group.add(s2);

    if (i % 3 === 0) {
      const len = Math.sqrt((x2-x1)**2 + (z2-z1)**2);
      const cyl = new THREE.CylinderGeometry(.025, .025, len, 5);
      const br  = new THREE.Mesh(cyl, matBr);
      br.position.set((x1+x2)/2, y, (z1+z2)/2);
      br.rotation.z = Math.PI / 2;
      br.rotation.y = Math.atan2(z2-z1, x2-x1);
      group.add(br);
    }
  }
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, .3));
  const pl = new THREE.PointLight(0x07cfe0, 2.5, 20);
  pl.position.set(3, 4, 5);
  scene.add(pl);
  const pl2 = new THREE.PointLight(0x8b5cf6, 1.2, 18);
  pl2.position.set(-3, -3, 4);
  scene.add(pl2);

  let mx = 0, my = 0;
  const onMove = e => {
    mx = (e.clientX / window.innerWidth - .5) * 2;
    my = (e.clientY / window.innerHeight - .5) * 2;
  };
  window.addEventListener('mousemove', onMove);

  function animate() {
    _dnaFrame = requestAnimationFrame(animate);
    group.rotation.y += .006;
    group.rotation.x += (my * .25 - group.rotation.x) * .04;
    renderer.render(scene, camera);
  }
  animate();
}

/* ── Hero canvas: subtle particle field for public site ─────────── */
function initHeroScene() {
  if (typeof THREE === 'undefined') return;
  const canvas = $('hero-canvas');
  if (!canvas) return;

  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, .1, 200);
  camera.position.z = 40;

  const count = 180;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - .5) * 80;
    pos[i*3+1] = (Math.random() - .5) * 60;
    pos[i*3+2] = (Math.random() - .5) * 40;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x07cfe0, size: .15, transparent: true, opacity: .45 });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  let mx = 0;
  window.addEventListener('mousemove', e => { mx = (e.clientX / window.innerWidth - .5) * 2; });

  function animate() {
    requestAnimationFrame(animate);
    pts.rotation.y += .00018;
    pts.rotation.x += .00008;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

/* ================================================================
   CHART.JS — Dashboard Analytics
   ================================================================ */
let _chartTrend = null, _chartDept = null;

function initDashCharts() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.color = '#8fa5be';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";

  // Appointment trend (last 7 days, derived from db)
  const days = [];
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    days.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
    counts.push(db.appointment.filter(a => a.AppointmentDate === ds).length);
  }
  // Add slight random for demo richness (only when all zeros)
  const hasData = counts.some(Boolean);
  const trendData = hasData ? counts : counts.map(() => Math.floor(Math.random() * 8 + 1));

  const canvTrend = document.getElementById('chart-trend');
  if (canvTrend) {
    if (_chartTrend) _chartTrend.destroy();
    _chartTrend = new Chart(canvTrend, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Appointments',
          data: trendData,
          borderColor: '#07cfe0',
          backgroundColor: 'rgba(7,207,224,.08)',
          tension: .4,
          fill: true,
          pointBackgroundColor: '#07cfe0',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { stepSize: 1, font: { size: 11 } } }
        }
      }
    });
  }

  // Department distribution doughnut
  const canvDept = document.getElementById('chart-dept');
  if (canvDept && db.department.length) {
    if (_chartDept) _chartDept.destroy();
    const deptLabels = db.department.map(d => d.DepartmentName);
    const deptCounts = db.department.map(d => db.doctor.filter(doc => doc.DepartmentID == d.DepartmentID).length || 1);
    const palette = ['#07cfe0','#3b87f5','#8b5cf6','#10b981','#f59e0b','#ef4444'];
    _chartDept = new Chart(canvDept, {
      type: 'doughnut',
      data: {
        labels: deptLabels,
        datasets: [{
          data: deptCounts,
          backgroundColor: deptLabels.map((_, i) => palette[i % palette.length] + 'cc'),
          borderColor: deptLabels.map((_, i) => palette[i % palette.length]),
          borderWidth: 1.5,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } }
        },
        cutout: '62%'
      }
    });
  }
}

/* ================================================================
   MICRO-INTERACTIONS
   ================================================================ */

/* 3-D card tilt on mouse move */
function applyCardTilt() {
  document.querySelectorAll('.card,.c,.stat').forEach(card => {
    if (card._tiltBound) return;
    card._tiltBound = true;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `translateY(-7px) rotateX(${-y*10}deg) rotateY(${x*10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* Animated counters for stat numbers */
function animateCounters() {
  document.querySelectorAll('.card b, .stat b').forEach(el => {
    const raw = el.textContent.trim();
    const num2 = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!isFinite(num2) || num2 === 0) return;
    const prefix = raw.startsWith('₹') ? '₹' : '';
    const fmt = n => prefix + (Number.isInteger(num2) ? Math.round(n).toLocaleString('en-IN') : n.toFixed(2));
    let start = 0;
    const duration = 900;
    const startTime = performance.now();
    const tick = t => {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = fmt(num2 * ease);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    };
    requestAnimationFrame(tick);
  });
}

/* ================================================================
   INITIALIZE ON PAGE LOAD
   ================================================================ */
// Show login screen, start 3D canvas right away
document.addEventListener('DOMContentLoaded', () => {
  initLoginScene();
  initHeroScene();
});

// Also init public site data (behind the login screen)
site();s