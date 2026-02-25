/**
 * Quiz proxy: call Gemini API so the frontend can use "Generate Quiz"
 * without running Spring Boot or MySQL.
 *
 * Run: node quiz-proxy.js
 * Then start Angular (ng serve) and set quizApiUrl to http://localhost:3001 in environment.
 *
 * API key is hardcoded below; remove before committing.
 */
const GEMINI_API_KEY = 'AIzaSyD6c79R1V1zPVQFJCGjRQIVy4OplJE9FhM';
const PORT = 3001;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function buildPrompt(body) {
  const topic = body?.topic ?? 'general English';
  const difficulty = body?.difficulty ?? 'medium';
  const numQuestions = Math.min(20, Math.max(1, Number(body?.numQuestions) || 5));
  return `You are an English quiz generator. Generate a quiz as a single valid JSON object with this exact structure (no markdown, no code fence, no extra text):
{"title":"Quiz title here","questions":[{"content":"Question text?","type":"QCM","options":["Option A","Option B","Option C","Option D"],"correctIndex":0}]}
Rules:
- topic: ${topic}
- difficulty: ${difficulty}
- number of questions: ${numQuestions}
- type must be either "QCM" (4 options) or "TRUE_FALSE" (options: ["True","False"], correctIndex 0 or 1)
- All question text and options in English
- correctIndex is 0-based index of the correct option
Return only the JSON object, nothing else.`;
}

async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });
  const responseText = await res.text();
  if (!res.ok) {
    console.error('Gemini API error:', res.status, responseText);
    throw new Error(`Gemini API ${res.status}: ${responseText.slice(0, 200)}`);
  }
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error('Invalid JSON from Gemini: ' + responseText.slice(0, 100));
  }
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    const reason = data?.promptFeedback?.blockReason || 'No candidates returned';
    console.error('Gemini no candidate:', JSON.stringify(data?.promptFeedback || data));
    throw new Error('Gemini: ' + reason);
  }
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    const finishReason = candidate.finishReason || 'Unknown';
    throw new Error('Gemini empty text (finishReason: ' + finishReason + ')');
  }
  let raw = text.trim();
  if (raw.startsWith('```')) {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) raw = raw.substring(start, end + 1);
  }
  try {
    return JSON.parse(raw);
  } catch (parseErr) {
    console.error('Gemini response (first 500 chars):', raw.slice(0, 500));
    throw new Error('Invalid quiz JSON from Gemini: ' + parseErr.message);
  }
}

const server = require('http').createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/quiz/generate') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const body = await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  try {
    const prompt = buildPrompt(parsed);
    const quiz = await callGemini(prompt);
    if (!quiz.title || !Array.isArray(quiz.questions)) {
      throw new Error('Gemini did not return a valid quiz (title and questions array required)');
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(quiz));
  } catch (err) {
    console.error('Quiz generate error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Quiz generation failed' }));
  }
});

server.listen(PORT, () => {
  console.log(`Quiz proxy running at http://localhost:${PORT}`);
  console.log('Frontend: set quizApiUrl to http://localhost:' + PORT + '/api in environment to use it.');
});
