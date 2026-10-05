import { GoogleGenAI } from '@google/genai';
import config from '../config/config.js';

const apiKey = config.gemini?.apiKey || process.env.GEMINI_API_KEY || '';
const modelName = config.gemini?.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// The key stays on the server. Never pass it to the browser or return it in an API response.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export function isGeminiConfigured() {
  return Boolean(apiKey.trim());
}

export function getModelName() {
  return modelName;
}

function formatContents(messages) {
  return messages
    .filter((message) => typeof message?.content === 'string' && message.content.trim())
    .map((message) => ({
      role: message.role === 'assistant' || message.role === 'model' ? 'model' : 'user',
      parts: [{ text: message.content.trim() }]
    }));
}

function responseText(response) {
  const text = typeof response.text === 'string' ? response.text.trim() : '';
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

/** Send a multi-turn chat request through the current Google Gen AI SDK. */
export async function generateChatResponse({
  systemInstruction,
  messages = [],
  temperature = 0.4,
  maxOutputTokens = 1200
}) {
  if (!ai) {
    throw new Error('Gemini is not configured. Set GEMINI_API_KEY on the backend server.');
  }

  const contents = formatContents(messages);
  if (!contents.length) throw new Error('At least one chat message is required.');

  const response = await ai.models.generateContent({
    model: modelName,
    contents,
    config: {
      systemInstruction,
      temperature,
      maxOutputTokens
    }
  });

  return responseText(response);
}

/** Generate validated JSON for the structured symptom-triage flow. */
export async function generateStructuredJson({ systemInstruction, prompt }) {
  if (!ai) {
    throw new Error('Gemini is not configured. Set GEMINI_API_KEY on the backend server.');
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(responseText(response));
  } catch (error) {
    console.error('[Gemini Client] Structured triage generation failed:', error.message);
    return null;
  }
}

export default {
  isGeminiConfigured,
  getModelName,
  generateChatResponse,
  generateStructuredJson
};
