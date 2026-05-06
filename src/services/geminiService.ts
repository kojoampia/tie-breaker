/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { DecisionAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The primary options being compared or considered."
    },
    factors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          weight: { type: Type.NUMBER, description: "Initial suggested weight from 1 to 5 (always positive, mapped later to category)" },
          category: { type: Type.STRING, enum: ["pro", "con"] }
        },
        required: ["id", "text", "weight", "category"]
      }
    },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"]
    },
    comparisonTable: {
      type: Type.OBJECT,
      properties: {
        headers: { type: Type.ARRAY, items: { type: Type.STRING } },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              values: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["label", "values"]
          }
        }
      },
      required: ["headers", "rows"]
    },
    summary: {
      type: Type.STRING,
      description: "A brief AI summary or initial recommendation."
    }
  },
  required: ["options", "factors", "swot", "comparisonTable", "summary"]
};

export async function analyzeDecision(query: string): Promise<DecisionAnalysis> {
  const prompt = `Analyze the following decision query: "${query}". 
  Provide a comprehensive analysis including:
  1. A list of pros and cons (factors) with suggested impact weights (1-5).
  2. A SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
  3. A comparison table structure. If there's only one option, compare the "Doing it" vs "Not doing it" scenarios.
  4. A final summary or "tiebreaker" initial perspective.
  
  Ensure all IDs are unique strings. Ensure weights are sensible (1 = minor, 5 = major).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA as any,
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as DecisionAnalysis;
  } catch (error) {
    console.error("Error analyzing decision:", error);
    throw error;
  }
}
