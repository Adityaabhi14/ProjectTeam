import geminiClient from '../chatbot/geminiClient.js';

const windowMs = Number.parseInt(process.env.CHATBOT_RATE_LIMIT_WINDOW_MS || '60000', 10);
const maxRequests = Number.parseInt(process.env.CHATBOT_RATE_LIMIT_MAX || '20', 10);
const requestBuckets = new Map();

function sendValidationError(res, message) {
  return res.status(400).json({ success: false, message });
}

function trimText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : value;
}

function sanitizePatientInfo(patientInfo) {
  if (patientInfo === undefined) return {};
  if (!patientInfo || typeof patientInfo !== 'object' || Array.isArray(patientInfo)) return null;

  const safeFields = ['age', 'gender', 'allergies', 'medicalHistory'];
  return Object.fromEntries(
    safeFields
      .filter((field) => patientInfo[field] !== undefined)
      .map((field) => [field, typeof patientInfo[field] === 'string'
        ? trimText(patientInfo[field], 300)
        : patientInfo[field]])
  );
}

export function requireGeminiConfiguration(_req, res, next) {
  if (geminiClient.isGeminiConfigured()) return next();

  return res.status(503).json({
    success: false,
    code: 'GEMINI_NOT_CONFIGURED',
    message: 'The AI assistant is not configured. Set GEMINI_API_KEY on the backend server.'
  });
}

export function chatbotRateLimit(req, res, next) {
  const now = Date.now();
  const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
  const bucket = requestBuckets.get(clientKey);

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(clientKey, { count: 1, resetAt: now + windowMs });
    res.setHeader('RateLimit-Limit', maxRequests);
    res.setHeader('RateLimit-Remaining', Math.max(maxRequests - 1, 0));
    return next();
  }

  if (bucket.count >= maxRequests) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      code: 'CHATBOT_RATE_LIMITED',
      message: 'Too many chatbot requests. Please try again shortly.'
    });
  }

  bucket.count += 1;
  res.setHeader('RateLimit-Limit', maxRequests);
  res.setHeader('RateLimit-Remaining', Math.max(maxRequests - bucket.count, 0));
  return next();
}

export function validateChatMessage(req, res, next) {
  const { message, sessionId, patientInfo } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) {
    return sendValidationError(res, 'A non-empty "message" string is required.');
  }
  if (message.trim().length > 2000) {
    return sendValidationError(res, 'Message must not exceed 2,000 characters.');
  }
  if (sessionId !== undefined && (typeof sessionId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(sessionId))) {
    return sendValidationError(res, 'sessionId must contain only letters, numbers, underscores, or hyphens.');
  }

  const safePatientInfo = sanitizePatientInfo(patientInfo);
  if (safePatientInfo === null) {
    return sendValidationError(res, 'patientInfo must be an object when provided.');
  }

  req.body = {
    ...req.body,
    message: message.trim(),
    sessionId: sessionId?.trim(),
    patientInfo: safePatientInfo
  };
  return next();
}

export function validateTriageRequest(req, res, next) {
  const { symptoms } = req.body || {};
  if (typeof symptoms !== 'string' || !symptoms.trim()) {
    return sendValidationError(res, 'A non-empty "symptoms" string is required.');
  }
  if (symptoms.trim().length > 2000) {
    return sendValidationError(res, 'Symptoms must not exceed 2,000 characters.');
  }

  req.body = {
    ...req.body,
    symptoms: symptoms.trim(),
    duration: trimText(req.body.duration, 200),
    severity: trimText(req.body.severity, 50),
    gender: trimText(req.body.gender, 50),
    medicalHistory: trimText(req.body.medicalHistory, 500)
  };
  return next();
}
