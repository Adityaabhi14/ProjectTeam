import chatbotService from './chatbotService.js';
import hospitalContext from './hospitalContext.js';
import geminiClient from './geminiClient.js';

/**
 * Handle incoming conversational chat message
 * POST /api/chatbot/message or POST /api/chatbot/chat
 * Body: { message: string, sessionId?: string, patientInfo?: object }
 */
export async function handleChatMessage(req, res, next) {
  try {
    const { message, sessionId, patientInfo } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A valid "message" string is required in the request body.'
      });
    }

    const result = await chatbotService.processChatMessage({
      sessionId,
      message,
      patientInfo
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Perform structured symptom triage & doctor/medicine match
 * POST /api/chatbot/triage
 * Body: { symptoms: string, duration?: string, severity?: string, age?: number|string, gender?: string, medicalHistory?: string }
 */
export async function handleSymptomTriage(req, res, next) {
  try {
    const { symptoms, duration, severity, age, gender, medicalHistory } = req.body;

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A valid "symptoms" description is required in the request body.'
      });
    }

    const triageResult = await chatbotService.performHealthTriage({
      symptoms,
      duration,
      severity,
      age,
      gender,
      medicalHistory
    });

    res.json({
      success: true,
      data: triageResult
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get available hospital departments and doctors for matching
 * GET /api/chatbot/specialists
 */
export async function getSpecialists(req, res, next) {
  try {
    const [departments, doctors] = await Promise.all([
      hospitalContext.getHospitalDepartments(),
      hospitalContext.getHospitalDoctors()
    ]);

    res.json({
      success: true,
      data: {
        departments,
        doctors
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get available hospital medicines
 * GET /api/chatbot/medicines
 */
export async function getMedicines(req, res, next) {
  try {
    const medicines = await hospitalContext.getHospitalMedicines();
    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get conversation history for a given session
 * GET /api/chatbot/session/:sessionId
 */
export async function getSessionHistory(req, res, next) {
  try {
    const { sessionId } = req.params;
    const history = chatbotService.getSessionHistory(sessionId);

    res.json({
      success: true,
      sessionId,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset/Clear a chat session
 * POST /api/chatbot/session/reset or DELETE /api/chatbot/session/:sessionId
 */
export async function resetSession(req, res, next) {
  try {
    const sessionId = req.params.sessionId || req.body.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required to reset session.'
      });
    }

    const wasReset = chatbotService.resetSession(sessionId);
    res.json({
      success: true,
      message: wasReset ? `Session ${sessionId} has been cleared.` : `Session ${sessionId} was not found or already empty.`,
      sessionId
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Chatbot Health & AI Status Check
 * GET /api/chatbot/status
 */
export async function getChatbotStatus(req, res) {
  res.json({
    success: true,
    service: 'CarePoint AI Health Chatbot Backend',
    geminiConfigured: geminiClient.isGeminiConfigured(),
    model: geminiClient.getModelName(),
    features: [
      'Conversational AI Health Assistant via Google Gemini',
      'Intelligent Doctor & Department Recommendation',
      'Over-the-counter Medicine & First-aid Suggestions with Precautions',
      'Structured Symptom Triage Endpoint',
      'Emergency Red Flag Detection',
      'Live Hospital Directory Integration'
    ],
    timestamp: new Date().toISOString()
  });
}

export default {
  handleChatMessage,
  handleSymptomTriage,
  getSpecialists,
  getMedicines,
  getSessionHistory,
  resetSession,
  getChatbotStatus
};
