import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

const apiKey = config.gemini?.apiKey || process.env.GEMINI_API_KEY || '';
const modelName = config.gemini?.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Initialize SDK instance if API key is provided
let genAI = null;
let googleGenAI = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[Gemini Client] GoogleGenerativeAI init warning:', err.message);
  }
  try {
    googleGenAI = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[Gemini Client] GoogleGenAI init warning:', err.message);
  }
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured() {
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Get current configured model
 */
export function getModelName() {
  return modelName;
}

/**
 * Send a chat prompt with system instruction and history to Gemini API
 * @param {Object} params
 * @param {string} params.systemInstruction - System instructions guiding persona & guidelines
 * @param {Array<{role: string, content: string}>} params.messages - Conversation history
 * @param {number} [params.temperature=0.4] - Temperature for medical accuracy & empathy
 * @returns {Promise<string>} Text response from Gemini
 */
export async function generateChatResponse({
  systemInstruction,
  messages = [],
  temperature = 0.4,
  maxOutputTokens = 1200
}) {
  if (!isGeminiConfigured()) {
    console.warn('[Gemini Client] GEMINI_API_KEY is not set. Generating intelligent fallback response.');
    return generateFallbackChatResponse(messages);
  }

  // Format messages for GoogleGenerativeAI
  try {
    // Attempt with @google/genai or @google/generative-ai
    if (genAI) {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature,
          maxOutputTokens
        }
      });

      // Prepare contents history
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content || msg.text || '' }]
      }));

      const result = await model.generateContent({ contents });
      const response = await result.response;
      return response.text();
    }
  } catch (primaryErr) {
    console.error('[Gemini Client] Primary API call failed:', primaryErr.message);

    // Try fallback to standard REST fetch
    try {
      return await generateViaRestApi({
        apiKey,
        modelName,
        systemInstruction,
        messages,
        temperature
      });
    } catch (restErr) {
      console.error('[Gemini Client] REST API fallback failed:', restErr.message);
      return generateFallbackChatResponse(messages);
    }
  }

  return generateFallbackChatResponse(messages);
}

/**
 * Generate Structured JSON response using Gemini
 * @param {Object} params
 * @param {string} params.systemInstruction
 * @param {string} params.prompt
 * @returns {Promise<Object>} Parsed JSON object
 */
export async function generateStructuredJson({ systemInstruction, prompt }) {
  if (!isGeminiConfigured()) {
    return null;
  }

  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction ? { role: 'system', parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    }
  } catch (error) {
    console.error('[Gemini Client] Structured JSON generation error:', error.message);
    return null;
  }

  return null;
}

/**
 * Direct REST API call fallback for Gemini
 */
async function generateViaRestApi({ apiKey, modelName, systemInstruction, messages, temperature = 0.4 }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${apiKey}`;

  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content || msg.text || '' }]
  }));

  const payload = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: 1200
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini REST API returned ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No candidate text found in Gemini REST response');
  }
  return text;
}

/**
 * Local fallback response if GEMINI_API_KEY is not yet configured by the team
 */
function generateFallbackChatResponse(messages) {
  const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();

  let advice = "Hello! I am your CarePoint AI Health Assistant. How are you feeling today? Please let me know what symptoms you are experiencing.";

  if (lastMsg.includes('chest pain') || lastMsg.includes('heart') || lastMsg.includes('breathing')) {
    advice = `### ⚠️ Immediate Medical Attention Recommended
If you are experiencing severe chest pain, shortness of breath, or pain radiating to your arm or jaw, please proceed immediately to the **Emergency Ward** or call emergency services.

**Department Recommendation:**
- **Department:** Cardiology (Block A, 1st Floor)
- **Suggested Doctor:** Dr. Ananya Rao (Senior Interventional Cardiologist)

**General Guidance:**
- Avoid physical exertion and remain seated in an upright, comfortable position.
- Do not take unprescribed cardiac medications without medical evaluation.

*(Note: Please configure GEMINI_API_KEY in .env for full real-time AI capabilities.)*`;
  } else if (lastMsg.includes('fever') || lastMsg.includes('cold') || lastMsg.includes('cough') || lastMsg.includes('headache')) {
    advice = `### 🩺 Symptom Assessment & Care Recommendation
It sounds like you may be experiencing a viral infection, common cold, or mild fever.

**Department Recommendation:**
- **Department:** General Medicine (Block Main, Ground Floor)
- **Suggested Doctor:** Dr. Rajesh Verma (General Physician & Consultant)

**Suggested Relief & Precautions:**
- **Paracetamol 500mg**: For mild fever and headache relief (as directed by physician/pharmacist, max 1 tablet every 6-8 hours).
- **Cetirizine 10mg**: If you have sneezing, runny nose, or allergic symptoms.
- **Hydration & Rest**: Drink plenty of warm fluids, electrolytes, and get adequate rest.

⚠️ **Medical Disclaimer:** This is an informational assessment. If your fever exceeds 102°F (38.9°C) or lasts over 3 days, please schedule an in-person consultation with a doctor.

*(Note: Please configure GEMINI_API_KEY in .env for full real-time AI capabilities.)*`;
  } else if (lastMsg.includes('bone') || lastMsg.includes('joint') || lastMsg.includes('back') || lastMsg.includes('knee') || lastMsg.includes('fracture')) {
    advice = `### 🩺 Orthopedic Guidance
For joint pain, bone discomfort, or stiffness:

**Department Recommendation:**
- **Department:** Orthopedics (Block C, 2nd Floor)
- **Suggested Doctor:** Dr. Manish Reddy (Orthopedic & Joint Replacement Surgeon)

**Suggested Measures:**
- Apply ice pack for acute swelling or warm compress for chronic stiffness.
- Avoid lifting heavy weights or strenuous physical activities.
- **Ibuprofen 400mg**: May help alleviate inflammation and joint pain after meals (consult a doctor if you have gastric issues or kidney concerns).

*(Note: Please configure GEMINI_API_KEY in .env for full real-time AI capabilities.)*`;
  } else if (lastMsg.includes('child') || lastMsg.includes('baby') || lastMsg.includes('infant') || lastMsg.includes('kid')) {
    advice = `### 👶 Pediatric Care Recommendation
For children and infants:

**Department Recommendation:**
- **Department:** Pediatrics (Block B, Ground Floor)
- **Suggested Doctor:** Dr. Sameer Khan (Pediatric Specialist & Neonatologist)

**Safety Reminder:**
- Never give adult dosages or aspirin to infants and children without pediatrician consultation.
- Monitor hydration and temperature closely.

*(Note: Please configure GEMINI_API_KEY in .env for full real-time AI capabilities.)*`;
  }

  return advice;
}

export default {
  isGeminiConfigured,
  getModelName,
  generateChatResponse,
  generateStructuredJson
};
