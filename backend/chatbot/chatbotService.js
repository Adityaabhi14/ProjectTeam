import geminiClient from './geminiClient.js';
import hospitalContext from './hospitalContext.js';
import prompts from './prompts.js';
import { randomUUID } from 'crypto';

// In-memory conversation session store (can be replaced/augmented with Redis or DB by teammates)
const sessionStore = new Map();
const SESSION_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

/**
 * Clean up expired sessions periodically
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, data] of sessionStore.entries()) {
    if (now - data.lastUpdated > SESSION_TTL_MS) {
      sessionStore.delete(sessionId);
    }
  }
}
setInterval(cleanupExpiredSessions, 1000 * 60 * 15);

/**
 * Get or create session history
 */
export function getOrCreateSession(sessionId) {
  if (!sessionId) {
    sessionId = `session_${randomUUID()}`;
  }

  let session = sessionStore.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      history: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      patientInfo: {}
    };
    sessionStore.set(sessionId, session);
  }
  return session;
}

/**
 * Process a user's conversational message with Gemini
 * @param {Object} params
 * @param {string} params.sessionId - Unique chat session ID
 * @param {string} params.message - The user's input/symptom message
 * @param {Object} [params.patientInfo] - Optional patient context (age, allergies, past illnesses)
 * @returns {Promise<Object>} Formatted response with AI message and recommendations
 */
export async function processChatMessage({ sessionId, message, patientInfo = {} }) {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Message content is required');
  }

  const session = getOrCreateSession(sessionId);
  session.lastUpdated = Date.now();
  if (Object.keys(patientInfo).length > 0) {
    session.patientInfo = { ...session.patientInfo, ...patientInfo };
  }

  // Add user message to history
  session.history.push({
    role: 'user',
    content: message.trim(),
    timestamp: new Date().toISOString()
  });

  // Limit conversation history to last 16 turns to keep context window clean
  if (session.history.length > 16) {
    session.history = session.history.slice(session.history.length - 16);
  }

  // Build live hospital context (doctors, departments, pharmacy medicines)
  const hospitalDirText = await hospitalContext.buildHospitalContextPrompt();
  const systemInstruction = prompts.buildSystemPromptWithHospitalData(hospitalDirText);

  // Call Gemini
  const aiResponseText = await geminiClient.generateChatResponse({
    systemInstruction,
    messages: session.history.map(item => ({
      role: item.role,
      content: item.content
    })),
    temperature: 0.35
  });

  // Append assistant reply to history
  session.history.push({
    role: 'assistant',
    content: aiResponseText,
    timestamp: new Date().toISOString()
  });

  // Extract smart matched metadata from current doctors & departments for UI cards
  const matchedEntities = await extractHospitalMatches(message, aiResponseText);

  return {
    sessionId: session.sessionId,
    reply: aiResponseText,
    model: geminiClient.getModelName(),
    isGeminiActive: geminiClient.isGeminiConfigured(),
    recommendations: matchedEntities,
    timestamp: new Date().toISOString()
  };
}

/**
 * Perform structured symptom triage and matching
 * @param {Object} triageInput
 */
export async function performHealthTriage(triageInput) {
  const { symptoms, duration, severity, age, gender, medicalHistory } = triageInput;

  if (!symptoms) {
    throw new Error('Symptoms description is required for triage');
  }

  const hospitalDirText = await hospitalContext.buildHospitalContextPrompt();
  const systemInstruction = prompts.buildSystemPromptWithHospitalData(hospitalDirText);
  const triagePrompt = prompts.buildStructuredTriagePrompt({ symptoms, duration, severity, age, gender, medicalHistory });

  // Attempt structured JSON output from Gemini
  const structuredData = await geminiClient.generateStructuredJson({
    systemInstruction,
    prompt: triagePrompt
  });

  if (structuredData) {
    return structuredData;
  }

  // Fallback programmatic triage if JSON mode or API key is not ready
  const doctors = await hospitalContext.getHospitalDoctors();
  const departments = await hospitalContext.getHospitalDepartments();
  const medicines = await hospitalContext.getHospitalMedicines();

  const symLower = symptoms.toLowerCase();
  let matchedDept = 'General Medicine';
  let matchedDocs = doctors.filter(d => d.DepartmentName === 'General Medicine');
  let matchedMeds = medicines.filter(m => m.Category.includes('Analgesic') || m.Category.includes('Antipyretic'));
  let urgency = 'Moderate';
  let isEmergency = false;

  if (symLower.includes('chest') || symLower.includes('heart') || symLower.includes('palpitation')) {
    matchedDept = 'Cardiology';
    matchedDocs = doctors.filter(d => d.DepartmentName === 'Cardiology');
    matchedMeds = medicines.filter(m => m.Category.includes('Cardiovascular'));
    urgency = 'Emergency';
    isEmergency = true;
  } else if (symLower.includes('bone') || symLower.includes('joint') || symLower.includes('fracture') || symLower.includes('knee')) {
    matchedDept = 'Orthopedics';
    matchedDocs = doctors.filter(d => d.DepartmentName === 'Orthopedics');
    matchedMeds = medicines.filter(m => m.Category.includes('NSAID'));
    urgency = 'Moderate';
  } else if (symLower.includes('headache') || symLower.includes('nerve') || symLower.includes('dizzy') || symLower.includes('seizure')) {
    matchedDept = 'Neurology';
    matchedDocs = doctors.filter(d => d.DepartmentName === 'Neurology');
    matchedMeds = medicines.filter(m => m.MedicineName.includes('Paracetamol'));
    urgency = symLower.includes('seizure') ? 'Emergency' : 'Moderate';
  } else if (symLower.includes('child') || symLower.includes('baby') || symLower.includes('kid') || (age && parseInt(age, 10) < 14)) {
    matchedDept = 'Pediatrics';
    matchedDocs = doctors.filter(d => d.DepartmentName === 'Pediatrics');
    matchedMeds = [];
    urgency = 'Moderate';
  }

  return {
    summary: `Patient reports: ${symptoms}`,
    urgencyLevel: urgency,
    isEmergency,
    suggestedDepartment: matchedDept,
    suggestedSpecialistType: `${matchedDept} Specialist`,
    recommendedDoctorNames: matchedDocs.map(d => `Dr. ${d.FirstName} ${d.LastName}`),
    recommendedDoctors: matchedDocs,
    recommendedMedicines: matchedMeds.map(m => ({
      name: m.MedicineName,
      category: m.Category,
      purpose: m.Description,
      dosageGuidance: 'Take as directed by doctor or pharmacist. Read packaging label.',
      precautions: 'Do not exceed prescribed limit. Consult physician if symptoms persist.'
    })),
    homeCareTips: [
      'Maintain proper hydration with electrolytes and water.',
      'Ensure adequate rest and avoid heavy physical exertion.'
    ],
    disclaimer: 'This is an AI-assisted triage assessment. Always consult a certified physician for diagnosis.'
  };
}

/**
 * Extract matched hospital doctors and medicines based on message context
 */
async function extractHospitalMatches(userMsg, aiReply) {
  const [doctors, departments, medicines] = await Promise.all([
    hospitalContext.getHospitalDoctors(),
    hospitalContext.getHospitalDepartments(),
    hospitalContext.getHospitalMedicines()
  ]);

  const combinedText = `${userMsg} ${aiReply}`.toLowerCase();

  const matchedDepartments = departments.filter(dept =>
    combinedText.includes(dept.DepartmentName.toLowerCase())
  );

  const matchedDoctors = doctors.filter(doc =>
    combinedText.includes(doc.FirstName.toLowerCase()) ||
    combinedText.includes(doc.LastName.toLowerCase()) ||
    (doc.DepartmentName && combinedText.includes(doc.DepartmentName.toLowerCase()))
  );

  const matchedMedicines = medicines.filter(med =>
    combinedText.includes(med.MedicineName.toLowerCase().split(' ')[0]) ||
    combinedText.includes(med.Category.toLowerCase())
  );

  return {
    departments: matchedDepartments.slice(0, 2),
    doctors: matchedDoctors.slice(0, 3),
    medicines: matchedMedicines.slice(0, 4)
  };
}

/**
 * Clear or reset a specific session
 */
export function resetSession(sessionId) {
  if (sessionStore.has(sessionId)) {
    sessionStore.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * Get conversation history for a session
 */
export function getSessionHistory(sessionId) {
  const session = sessionStore.get(sessionId);
  return session ? session.history : [];
}

export default {
  processChatMessage,
  performHealthTriage,
  getOrCreateSession,
  resetSession,
  getSessionHistory
};
