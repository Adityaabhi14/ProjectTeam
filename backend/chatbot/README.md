# CarePoint AI Health Chatbot - Backend Module

This folder (`backend/chatbot/`) provides the complete AI Chatbot backend for the CarePoint Hospital Management System using the **Google Gemini API**.

The chatbot asks users how they are feeling, conducts medical triage, detects emergencies, and suggests the appropriate **doctor to consult**, **hospital department**, and **safe over-the-counter medicines / first-aid advice with precautions**.

---

## 📁 Folder Structure

```
backend/chatbot/
├── geminiClient.js          # Google Gemini SDK & REST API integration with graceful fallbacks
├── prompts.js               # Clinical system prompts, triage templates, and medical disclaimer rules
├── hospitalContext.js       # Live CarePoint database sync (Doctors, Departments, Medicines)
├── chatbotService.js        # Multi-turn conversation manager, memory store, and triage analysis
├── chatbotController.js     # HTTP request handlers for chat, triage, and doctor/medicine matching
├── chatbotRoutes.js         # Express route definitions mounted at /api/chatbot
├── index.js                 # Unified module exports
└── README.md                # Documentation & API integration guide for teammates
```

---

## ⚙️ Environment Configuration

Set your Gemini API Key in `backend/.env` (or project root `.env`):

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> **Note:** If `GEMINI_API_KEY` is not provided during local testing, the backend will automatically use intelligent mock triage responses so frontend and middleware development is never blocked.

---

## 📡 REST API Reference

Base Path: `/api/chatbot`

### 1. Send Chat Message (Main Conversational Endpoint)
Ask how the user is feeling and receive AI health guidance with doctor & medicine suggestions.

- **URL:** `POST /api/chatbot/message` (or `POST /api/chatbot/chat`)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "sessionId": "session_12345",
  "message": "I have had a bad headache and fever for 2 days. What doctor should I visit?",
  "patientInfo": {
    "age": 28,
    "gender": "Female",
    "allergies": "Penicillin"
  }
}
```

- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_12345",
    "reply": "### 🩺 Symptom Assessment\nI'm sorry you're feeling unwell. Based on your symptoms...\n\n**Department & Doctor Recommendation:**\n- **Department:** General Medicine\n- **Suggested Doctor:** Dr. Rajesh Verma (General Physician & Consultant)\n\n**Suggested OTC Relief:**\n- **Paracetamol 500mg**: For fever and headache relief (take after food, 1 tablet every 6-8 hours)...\n\n⚠️ *Disclaimer: This is for informational guidance only...*",
    "model": "gemini-2.5-flash",
    "isGeminiActive": true,
    "recommendations": {
      "departments": [
        {
          "DepartmentID": 5,
          "DepartmentName": "General Medicine",
          "Location": "Block Main, Ground Floor"
        }
      ],
      "doctors": [
        {
          "DoctorID": 5,
          "FirstName": "Rajesh",
          "LastName": "Verma",
          "Specialization": "General Physician & Consultant",
          "ConsultationFee": 400
        }
      ],
      "medicines": [
        {
          "MedicineID": 1,
          "MedicineName": "Paracetamol 500mg",
          "Category": "Analgesic / Antipyretic"
        }
      ]
    },
    "timestamp": "2026-10-04T09:55:00.000Z"
  }
}
```

---

### 2. Structured Symptom Triage Assessment
For health assessment forms and diagnostic checkups.

- **URL:** `POST /api/chatbot/triage`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "symptoms": "Sharp chest discomfort and shortness of breath when walking up stairs",
  "duration": "Since yesterday",
  "severity": "High",
  "age": 45,
  "gender": "Male",
  "medicalHistory": "Hypertension"
}
```

- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "summary": "Patient experiencing exertional chest discomfort and dyspnea with a history of hypertension.",
    "urgencyLevel": "Emergency",
    "isEmergency": true,
    "suggestedDepartment": "Cardiology",
    "suggestedSpecialistType": "Interventional Cardiologist",
    "recommendedDoctorNames": [
      "Dr. Ananya Rao"
    ],
    "recommendedMedicines": [
      {
        "name": "Emergency Medical Evaluation Required",
        "category": "Prescription / Clinical",
        "purpose": "Do not self-medicate for cardiac symptoms.",
        "dosageGuidance": "Seek immediate hospital admission.",
        "precautions": "Avoid physical exertion immediately."
      }
    ],
    "homeCareTips": [
      "Sit upright in a well-ventilated area.",
      "Do not drive yourself; call emergency services or have someone accompany you."
    ],
    "disclaimer": "Emergency advice: Immediate clinical examination is required."
  }
}
```

---

### 3. Get Active Specialists & Departments
- **URL:** `GET /api/chatbot/specialists`
- **Response (`200 OK`):** Returns live list of hospital departments and practicing doctors.

---

### 4. Get Available Hospital Pharmacy Medicines
- **URL:** `GET /api/chatbot/medicines`
- **Response (`200 OK`):** Returns active hospital medicines with categories and descriptions.

---

### 5. Get Chat Session History
- **URL:** `GET /api/chatbot/session/:sessionId`
- **Response (`200 OK`):** Returns conversation turns for the specified session ID.

---

### 6. Reset / Clear Session
- **URL:** `POST /api/chatbot/session/reset` (Body: `{ "sessionId": "..." }`) or `DELETE /api/chatbot/session/:sessionId`
- **Response (`200 OK`):** `{ "success": true, "message": "Session cleared." }`

---

### 7. Chatbot Service Status & Gemini Health Check
- **URL:** `GET /api/chatbot/status`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "service": "CarePoint AI Health Chatbot Backend",
  "geminiConfigured": true,
  "model": "gemini-2.5-flash",
  "features": [
    "Conversational AI Health Assistant via Google Gemini",
    "Intelligent Doctor & Department Recommendation",
    "Over-the-counter Medicine & First-aid Suggestions with Precautions",
    "Structured Symptom Triage Endpoint",
    "Emergency Red Flag Detection",
    "Live Hospital Directory Integration"
  ]
}
```

---

## 🤝 Teammate Integration Guide

### For Frontend Teammates:
1. Initialize a `sessionId` in `localStorage` or component state.
2. Make a `POST` request to `/api/chatbot/message` whenever the patient types a message.
3. Render `response.data.reply` with Markdown formatting.
4. Render `response.data.recommendations.doctors` as clickable "Book Appointment" cards directly linking to doctor booking.
5. Render `response.data.recommendations.medicines` as suggested pharmacy items.

### For Middleware Teammates:
1. To add authentication to the chatbot endpoints, insert your auth middleware (e.g. `verifyToken` / `authenticateUser`) into `chatbotRoutes.js` or in `backend/routes/index.js` before mounting `/chatbot`.
2. To add rate limiting, attach your rate limiter middleware on `/api/chatbot/message`.
3. To persist chat histories into MySQL database, plug your DB hook into `chatbotService.processChatMessage`.
