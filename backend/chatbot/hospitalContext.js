import { query } from '../config/db.js';

// Fallback hospital data in case database is offline
const FALLBACK_HOSPITAL_DATA = {
  departments: [
    { DepartmentID: 1, DepartmentName: 'Cardiology', Description: 'Heart health, ECG, angiography and cardiac intensive care.', Location: 'Block A, 1st Floor' },
    { DepartmentID: 2, DepartmentName: 'Pediatrics', Description: 'Infants, children, adolescent care and vaccination.', Location: 'Block B, Ground Floor' },
    { DepartmentID: 3, DepartmentName: 'Orthopedics', Description: 'Bone, joint, spine, arthritis, and sports injuries.', Location: 'Block C, 2nd Floor' },
    { DepartmentID: 4, DepartmentName: 'Neurology', Description: 'Brain, spine, migraines, and nervous system disorders.', Location: 'Block A, 3rd Floor' },
    { DepartmentID: 5, DepartmentName: 'General Medicine', Description: 'Primary care, adult internal medicine, fever, cold, flu, diabetes.', Location: 'Block Main, Ground Floor' }
  ],
  doctors: [
    { DoctorID: 1, DepartmentID: 1, FirstName: 'Ananya', LastName: 'Rao', DepartmentName: 'Cardiology', Specialization: 'Senior Interventional Cardiologist', Qualification: 'MBBS, MD (Cardiology), DM', ConsultationFee: 600.00 },
    { DoctorID: 2, DepartmentID: 2, FirstName: 'Sameer', LastName: 'Khan', DepartmentName: 'Pediatrics', Specialization: 'Pediatric Specialist & Neonatologist', Qualification: 'MBBS, MD (Pediatrics), DCH', ConsultationFee: 450.00 },
    { DoctorID: 3, DepartmentID: 3, FirstName: 'Manish', LastName: 'Reddy', DepartmentName: 'Orthopedics', Specialization: 'Orthopedic & Joint Replacement Surgeon', Qualification: 'MBBS, MS (Ortho), M.Ch', ConsultationFee: 700.00 },
    { DoctorID: 4, DepartmentID: 4, FirstName: 'Priya', LastName: 'Nair', DepartmentName: 'Neurology', Specialization: 'Consultant Neurologist', Qualification: 'MBBS, MD, DM (Neurology)', ConsultationFee: 750.00 },
    { DoctorID: 5, DepartmentID: 5, FirstName: 'Rajesh', LastName: 'Verma', DepartmentName: 'General Medicine', Specialization: 'General Physician & Consultant', Qualification: 'MBBS, MD (Internal Medicine)', ConsultationFee: 400.00 }
  ],
  medicines: [
    { MedicineID: 1, MedicineName: 'Paracetamol 500mg', Category: 'Analgesic / Antipyretic', Description: 'Fever reducer and mild to moderate pain reliever.' },
    { MedicineID: 2, MedicineName: 'Amoxicillin 500mg', Category: 'Antibiotic', Description: 'Broad-spectrum penicillin antibiotic for bacterial infections (Prescription only).' },
    { MedicineID: 3, MedicineName: 'Atorvastatin 10mg', Category: 'Cardiovascular / Statin', Description: 'Cholesterol-lowering medication for heart disease prevention.' },
    { MedicineID: 4, MedicineName: 'Metformin 500mg', Category: 'Antidiabetic', Description: 'Oral diabetes medicine helping control blood sugar levels.' },
    { MedicineID: 5, MedicineName: 'Ibuprofen 400mg', Category: 'NSAID / Anti-inflammatory', Description: 'Relieves inflammation, swelling and joint pain.' },
    { MedicineID: 6, MedicineName: 'Pantoprazole 40mg', Category: 'Gastrointestinal / PPI', Description: 'Reduces stomach acid and prevents acid reflux.' },
    { MedicineID: 7, MedicineName: 'Cetirizine 10mg', Category: 'Antihistamine', Description: 'Relief from allergy symptoms, cold, sneezing and rashes.' }
  ]
};

/**
 * Fetch active hospital doctors and departments from DB with fallback
 */
export async function getHospitalDoctors() {
  try {
    const doctors = await query(`
      SELECT d.DoctorID, d.FirstName, d.LastName, d.Specialization, d.Qualification, d.ConsultationFee,
             dept.DepartmentID, dept.DepartmentName, dept.Location AS DepartmentLocation, dept.PhoneNo AS DepartmentPhone
      FROM doctors d
      LEFT JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      ORDER BY dept.DepartmentName ASC, d.FirstName ASC
    `);

    if (doctors && doctors.length > 0) {
      return doctors;
    }
  } catch (err) {
    console.warn('[Hospital Context] Using fallback doctors data (DB offline or query failed):', err.message);
  }
  return FALLBACK_HOSPITAL_DATA.doctors;
}

/**
 * Fetch active hospital departments
 */
export async function getHospitalDepartments() {
  try {
    const depts = await query(`
      SELECT DepartmentID, DepartmentName, Description, Location, PhoneNo
      FROM departments
      ORDER BY DepartmentName ASC
    `);

    if (depts && depts.length > 0) {
      return depts;
    }
  } catch (err) {
    console.warn('[Hospital Context] Using fallback departments data:', err.message);
  }
  return FALLBACK_HOSPITAL_DATA.departments;
}

/**
 * Fetch available hospital pharmacy medicines
 */
export async function getHospitalMedicines() {
  try {
    const medicines = await query(`
      SELECT MedicineID, MedicineName, Category, Description, UnitPrice, IsActive
      FROM medicines
      WHERE IsActive = TRUE
      ORDER BY Category ASC, MedicineName ASC
    `);

    if (medicines && medicines.length > 0) {
      return medicines;
    }
  } catch (err) {
    console.warn('[Hospital Context] Using fallback medicines data:', err.message);
  }
  return FALLBACK_HOSPITAL_DATA.medicines;
}

/**
 * Formats a summarized string context of available hospital doctors & departments for Gemini prompts
 */
export async function buildHospitalContextPrompt() {
  const [departments, doctors, medicines] = await Promise.all([
    getHospitalDepartments(),
    getHospitalDoctors(),
    getHospitalMedicines()
  ]);

  const deptList = departments
    .map(d => `- **${d.DepartmentName}** (${d.Location || 'Hospital Main'}): ${d.Description}`)
    .join('\n');

  const docList = doctors
    .map(d => `- **Dr. ${d.FirstName} ${d.LastName}** | Department: ${d.DepartmentName || 'General'} | Specialization: ${d.Specialization} | Qualifications: ${d.Qualification} | Fee: ₹${d.ConsultationFee}`)
    .join('\n');

  const medList = medicines
    .map(m => `- ${m.MedicineName} [${m.Category}]: ${m.Description}`)
    .join('\n');

  return `
### HOSPITAL DIRECTORY (CarePoint Hospital):
#### Available Departments:
${deptList}

#### Available Doctors:
${docList}

#### Available Hospital Pharmacy Medicines (Common OTC / Stock):
${medList}
`;
}

export default {
  getHospitalDoctors,
  getHospitalDepartments,
  getHospitalMedicines,
  buildHospitalContextPrompt
};
