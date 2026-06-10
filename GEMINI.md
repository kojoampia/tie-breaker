# tie-breaker (The Tiebreaker)

An AI-powered decision-making assistant for complex choices.

## Project Overview
The Tiebreaker helps users make informed decisions by providing structured analysis, including pros and cons, comparison tables, and SWOT analysis with weighted scoring.

## Tech Stack
- **Frontend:** React with Vite
- **Language:** TypeScript
- **AI Integration:** Gemini API (managed via `src/services/geminiService.ts`)
- **Styling:** CSS

## Core Workflows
- **Decision Input:** Gathering factors and options for a decision.
- **Multi-perspective Analysis:** Generating SWOT and comparison views.
- **Weighted Scoring:** Calculating scores based on user-defined importance.

## Architecture
- `src/components/`: Modular views for different analysis types (SWOT, Pairwise, etc.).
- `src/services/geminiService.ts`: Centralizes decision-support logic powered by AI.
