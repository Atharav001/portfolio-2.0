// To update the chatbot's knowledge:
// 1. Edit or add a .md file in /chatbot-data/
// 2. Run this script (`node scripts/ingest.mjs` or via GitHub Action on push) to re-embed and update Supabase.
// No other code changes are needed.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Load .env.local or .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GOOGLE_AI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables. Please check .env.local:');
  console.error({
    GOOGLE_AI_API_KEY: !!GOOGLE_AI_API_KEY,
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
  });
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });

function chunkMarkdownFile(fileContent, fileName) {
  const sections = fileContent.split(/(?=\n##\s)/g);
  const chunks = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // If section is under ~2000 chars (approx 500 tokens), keep intact
    if (trimmed.length <= 2000) {
      chunks.push(trimmed);
    } else {
      // Split on paragraphs if section is too long
      const paragraphs = trimmed.split(/\n\n+/);
      let currentChunk = '';
      for (const p of paragraphs) {
        if ((currentChunk + '\n\n' + p).length > 2000) {
          if (currentChunk.trim()) chunks.push(currentChunk.trim());
          currentChunk = p;
        } else {
          currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
    }
  }

  return chunks;
}

async function embedText(text) {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });
    const embedding = response.embedding?.values;
    if (!embedding || embedding.length === 0) {
      throw new Error('Received empty embedding values from Gemini');
    }
    return embedding;
  } catch (err) {
    console.error(`❌ Embedding failed for text snippet: "${text.slice(0, 50)}..."`, err);
    throw err;
  }
}

async function runIngestion() {
  const dataDir = path.join(rootDir, 'chatbot-data');
  if (!fs.existsSync(dataDir)) {
    console.error(`❌ chatbot-data directory not found at ${dataDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.md'));
  console.log(`🚀 Found ${files.length} knowledge base files in ${dataDir}`);

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const chunks = chunkMarkdownFile(content, file);
    console.log(`\n📄 Processing "${file}" (${chunks.length} chunks)...`);

    // First: Delete existing records for this source file
    const { error: deleteError } = await supabase
      .from('knowledge_chunks')
      .delete()
      .eq('source_file', file);

    if (deleteError) {
      console.error(`❌ Failed to delete old chunks for ${file}:`, deleteError);
      continue;
    }

    const rowsToInsert = [];
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunkContent = chunks[idx];
      console.log(`  └─ Embedding chunk ${idx + 1}/${chunks.length}...`);
      const vector = await embedText(chunkContent);
      rowsToInsert.push({
        source_file: file,
        chunk_index: idx,
        content: chunkContent,
        embedding: vector,
      });
    }

    // Insert new chunks
    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('knowledge_chunks')
        .insert(rowsToInsert);

      if (insertError) {
        console.error(`❌ Failed to insert chunks for ${file}:`, insertError);
      } else {
        console.log(`✅ Successfully upserted ${rowsToInsert.length} chunks for ${file}`);
      }
    }
  }

  console.log('\n🎉 Ingestion complete!');
}

runIngestion().catch((err) => {
  console.error('❌ Fatal error during ingestion:', err);
  process.exit(1);
});
