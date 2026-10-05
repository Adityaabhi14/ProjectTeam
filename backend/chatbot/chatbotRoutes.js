import express from 'express';
import chatbotController from './chatbotController.js';
import {
  chatbotRateLimit,
  requireGeminiConfiguration,
  validateChatMessage,
  validateTriageRequest
} from '../middleware/chatbotMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/chatbot/status
 * @desc    Check AI Chatbot service health and Gemini API status
 * @access  Public
 */
router.get('/status', chatbotController.getChatbotStatus);

/**
 * @route   POST /api/chatbot/message
 * @route   POST /api/chatbot/chat
 * @desc    Send a message to the AI chatbot, get conversational response + suggested doctors & medicines
 * @access  Public (Middleware can be plugged in by teammates)
 */
router.post('/message', chatbotRateLimit, requireGeminiConfiguration, validateChatMessage, chatbotController.handleChatMessage);
router.post('/chat', chatbotRateLimit, requireGeminiConfiguration, validateChatMessage, chatbotController.handleChatMessage);

/**
 * @route   POST /api/chatbot/triage
 * @desc    Submit structured symptoms report to get urgency level, suggested doctor/department, and safe medicines
 * @access  Public
 */
router.post('/triage', chatbotRateLimit, requireGeminiConfiguration, validateTriageRequest, chatbotController.handleSymptomTriage);

/**
 * @route   GET /api/chatbot/specialists
 * @desc    Retrieve hospital departments & doctors for recommendation
 * @access  Public
 */
router.get('/specialists', chatbotController.getSpecialists);

/**
 * @route   GET /api/chatbot/medicines
 * @desc    Retrieve available hospital medicines for suggestion
 * @access  Public
 */
router.get('/medicines', chatbotController.getMedicines);

/**
 * @route   GET /api/chatbot/session/:sessionId
 * @desc    Retrieve conversation history for a given session
 * @access  Public
 */
router.get('/session/:sessionId', chatbotController.getSessionHistory);

/**
 * @route   POST /api/chatbot/session/reset
 * @route   DELETE /api/chatbot/session/:sessionId
 * @desc    Clear/reset conversation session
 * @access  Public
 */
router.post('/session/reset', chatbotController.resetSession);
router.delete('/session/:sessionId', chatbotController.resetSession);

export default router;
