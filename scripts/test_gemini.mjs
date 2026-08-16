import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local') });
dotenv.config({ path: path.join(projectRoot, '.env') });

const apiKey = process.env.GOOGLE_AI_API_KEY;
console.log('API Key present:', !!apiKey);

const ai = new GoogleGenAI({ apiKey });

const modelsToTest = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite'
];

async function testModels() {
  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await ai.models.generateContent({
        model,
        contents: 'Say hello in 3 words',
      });
      console.log(`✅ SUCCESS [${model}]:`, res.text);
    } catch (err) {
      console.error(`❌ FAILED [${model}]:`, err.message || err);
    }
  }
}

testModels();
