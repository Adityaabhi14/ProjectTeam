import chatbotService from './chatbotService.js';
import hospitalContext from './hospitalContext.js';
import geminiClient from './geminiClient.js';

async function runChatbotBackendTests() {
  console.log('🧪 Starting CarePoint AI Chatbot Backend Unit & Integration Tests...\n');

  try {
    // 1. Test Hospital Context
    console.log('1️⃣ Testing Hospital Context & Directory Formatting...');
    const promptContext = await hospitalContext.buildHospitalContextPrompt();
    console.log('✅ Hospital Context Generated successfully:');
    console.log(promptContext.slice(0, 300) + '...\n');

    // 2. Test Gemini Client Config Status
    console.log('2️⃣ Testing Gemini API Config Status...');
    const isConfigured = geminiClient.isGeminiConfigured();
    console.log(`ℹ️ Gemini API Key Configured: ${isConfigured}`);
    console.log(`ℹ️ Configured Model: ${geminiClient.getModelName()}\n`);

    // 3. Test Conversational Message Processing
    console.log('3️⃣ Testing Conversational Message Processing...');
    const chatResult = await chatbotService.processChatMessage({
      sessionId: 'test_session_101',
      message: 'I have a sore throat, mild fever and cough for 2 days. Which doctor should I visit and what medicine can I take?',
      patientInfo: { age: 30, gender: 'Male' }
    });

    console.log('✅ Chat response received:');
    console.log('--- AI Reply Preview ---');
    console.log(chatResult.reply);
    console.log('------------------------');
    console.log('Matched Recommendations:', JSON.stringify(chatResult.recommendations, null, 2));
    console.log('\n');

    // 4. Test Structured Triage
    console.log('4️⃣ Testing Structured Symptom Triage Endpoint...');
    const triageResult = await chatbotService.performHealthTriage({
      symptoms: 'Chest tightness and shortness of breath while climbing stairs',
      duration: 'Since morning',
      severity: 'High',
      age: 50,
      gender: 'Male',
      medicalHistory: 'Hypertension'
    });

    console.log('✅ Structured Triage Result:');
    console.log(JSON.stringify(triageResult, null, 2));

    // 5. Test Session Memory
    console.log('\n5️⃣ Testing Multi-turn Session Memory...');
    const followUp = await chatbotService.processChatMessage({
      sessionId: 'test_session_101',
      message: 'Can I take Paracetamol after food?'
    });
    console.log('✅ Follow-up reply received with session continuity:');
    console.log(followUp.reply.slice(0, 200) + '...\n');

    const history = chatbotService.getSessionHistory('test_session_101');
    console.log(`✅ Session history contains ${history.length} messages.`);

    console.log('\n🎉 ALL AI CHATBOT BACKEND TESTS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runChatbotBackendTests();
