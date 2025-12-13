import { GoogleGenAI, Schema, Type } from "@google/genai";
import { RoastCard, FixResult, RoastResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey });

const roastSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    archetype: {
      type: Type.STRING,
      description: "A funny, rude, or savage archetype name for the coder (e.g., 'The Spaghetti Monster', 'Copy-Paste Warrior').",
    },
    score: {
      type: Type.INTEGER,
      description: "A code quality score from 0 (garbage) to 100 (god-tier).",
    },
    emoji: {
      type: Type.STRING,
      description: "A single emoji representing the code vibe.",
    },
    image_prompt: {
      type: Type.STRING,
      description: "A short, vivid visual description of the character for an AI image generator. MUST follow the defined Visual Archetypes.",
    },
    theme_color: {
      type: Type.STRING,
      description: "A Hex color code (e.g., #FF0000) that fits the archetype's vibe (Red for bad, Green for good, Purple for chaotic, etc).",
    },
    quote: {
      type: Type.STRING,
      description: "A short, punchy, savage one-liner summary.",
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        sanity: { type: Type.INTEGER, description: "0-100 rating of logic sanity." },
        efficiency: { type: Type.INTEGER, description: "0-100 rating of performance." },
        style: { type: Type.INTEGER, description: "0-100 rating of code style." },
      },
      required: ["sanity", "efficiency", "style"],
    },
    details: {
      type: Type.STRING,
      description: "A Markdown formatted paragraph roasting the code in detail.",
    },
  },
  required: ["archetype", "score", "emoji", "image_prompt", "theme_color", "quote", "stats", "details"],
};

const fixSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    mode: { type: Type.STRING, enum: ["fix"] },
    fixed_code: { type: Type.STRING, description: "The refactored, clean, production-ready code." },
    explanation: { type: Type.STRING, description: "Brief, helpful explanation of what you fixed." },
    new_rank: { type: Type.STRING, description: "A new, complimentary title (e.g., 'Clean Code Paladin')." },
  },
  required: ["mode", "fixed_code", "explanation", "new_rank"],
};

export const generateRoast = async (codeInput: string): Promise<RoastResponse> => {
  try {
    const model = 'gemini-3-pro-preview'; 
    const isFixMode = codeInput.startsWith("MODE: FIX");

    let systemInstruction = '';
    let schema: Schema;

    if (isFixMode) {
      systemInstruction = `
        You are the "Benevolent Clean Code Architect". 
        Your goal is to take the user's messy code and refactor it into clean, efficient, production-ready code.
        1. Ignore the previous roast persona. Be helpful and constructive.
        2. Fix logic errors, improve naming, and optimize performance.
        3. Provide a brief explanation of the changes.
        4. Assign a new, cool rank title.
      `;
      schema = fixSchema;
    } else {
      systemInstruction = `
        You are GitMad, a legendary, cynical, and ruthless senior software engineer from the 90s hacker scene. 
        Your job is to roast the code provided by the user and generate an RPG-style "Character Card".
        
        Guidelines:
        1. Be savage but accurate.
        2. Point out specific logic errors and bad practices.
        3. Pick a "theme_color" that matches the severity of the code quality.

        4. IMAGE PROMPT GENERATION RULES (STRICT):
        You are currently generating too many "Zombie" style images. Update your logic for generating the image_prompt. 
        Instead of defaulting to horror/zombies, you MUST map the specific code error to one of these distinct Visual Archetypes:

        - The Spaghetti Chef: (For nested loops/messy logic) -> Visual: A chaotic Italian chef entangled in glowing neon pasta cables.
        - The Arsonist: (For dangerous/insecure code) -> Visual: A maniacal raccoon standing in front of a burning server room.
        - The Fossil: (For outdated syntax/old libraries) -> Visual: A dusty skeleton coding on a stone tablet in a museum.
        - The Clown: (For silly logic errors) -> Visual: A sad cyber-clown trying to juggle too many error messages.
        - The Snail: (For slow/inefficient code) -> Visual: A futuristic racing snail falling asleep at a keyboard.

        Rule: Analyze the code first. Pick the Archetype that best matches the specific flaw. Never use the same archetype twice in a row.
      `;
      schema = roastSchema;
    }

    const response = await ai.models.generateContent({
      model,
      contents: codeInput,
      config: {
        systemInstruction,
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from mainframe.");
    }

    return JSON.parse(text) as RoastResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Determine context for error fallback
    if (codeInput.startsWith("MODE: FIX")) {
        throw error; // Let the UI handle fix errors
    }

    // Fallback mock data for Roast
    return {
      archetype: "System Failure",
      score: 0,
      emoji: "💀",
      image_prompt: "A glitchy computer skull, cyberpunk style, red and black, error screen background",
      theme_color: "#FF0000",
      quote: "The code was so bad it killed the API.",
      stats: { sanity: 0, efficiency: 0, style: 0 },
      details: "Connection severed. The mainframe rejected your request."
    };
  }
};