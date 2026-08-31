import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parsing with large limit for base64 images
app.use(express.json({ limit: '25mb' }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: key.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// xAI Grok Key access
}

// Dynamic model cache for xAI
let cachedGrokModels: { models: string[]; timestamp: number } | null = null;

async function fetchAvailableGrokModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (cachedGrokModels && now - cachedGrokModels.timestamp < 300000) {
    return cachedGrokModels.models;
  }

  try {
    const res = await fetch('https://api.x.ai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      const modelList = Array.isArray(data?.data) ? data.data.map((m: any) => m.id) : [];
      if (modelList.length > 0) {
        console.log('[xAI Grok API] Discovered available models for key:', modelList);
        cachedGrokModels = { models: modelList, timestamp: now };
        return modelList;
      }
    } else {
      const errTxt = await res.text();
      if (res.status === 401 || (res.status === 400 && errTxt.includes('Incorrect API key'))) {
        throw new Error(`Authentication Error: Incorrect or missing xAI API key.`);
      }
      console.warn(`[xAI Grok API] GET /v1/models response (${res.status}): ${errTxt}`);
    }
  } catch (err: any) {
    if (err?.message && err.message.includes('Authentication Error')) {
      throw err; // Bubble up auth errors immediately without logging here
    }
    console.warn('[xAI Grok API] Could not list models from /v1/models:', err?.message || err);
  }

  return [];
}

// Grok Vision / Chat caller with dynamic model discovery and fallback
async function callGrokApiWithFallback(
  messages: any[],
  responseJson: boolean = false,
  isVision: boolean = true
) {
