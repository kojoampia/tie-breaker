# The Tiebreaker: Architectural Decision Analysis

**The Tiebreaker** is an AI-powered equilibrium analysis platform designed to break circular decision loops. It leverages advanced algorithmic weight assessment and geometric balance to provide structured, objective insights into complex choices.

Built with a "Brutalist Architectural" aesthetic, it transforms vague dilemmas into precise, data-driven reports.

## 🚀 Key Features

- **Multi-Perspective Analysis:** Generate comprehensive reports including:
  - **Weighted Factor Analysis:** Automated identification of Pros and Cons with adjustable impact weights (1-5).
  - **SWOT Matrix:** Strategic mapping of Strengths, Weaknesses, Opportunities, and Threats.
  - **Comparison Matrix:** Side-by-side evaluation of primary options or "Action vs. Inaction" scenarios.
  - **Pairwise Comparison:** Granular, relative evaluation of individual factors to minimize cognitive bias.
- **AI-Driven Logic:** Powered by Gemini 1.5 Flash for high-speed, intelligent synthesis and sentiment analysis.
- **Decision Persistence:** Local history tracking ("Archived Nodes") for revisiting and reviewing past trace logs.
- **Export Capabilities:** Export your decision architecture in multiple formats:
    - Binary Full JSON (Standard data exchange)
    - Full Text Report (Human-readable summary)
    - SWOT Core (Strategic focus)
    - Matrix Mapping (Tabular data)
    - Weighted Factors (Impact focus)
- **Modern Interface:** High-contrast, motion-enhanced UI built for precision and clarity.

## 🛠 Tech Stack

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI Integration:** [Google Gemini SDK](https://ai.google.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tie-breaker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## 🧠 How it Works

1. **Query Input:** Enter a decision node (e.g., "Relocate HQ to Austin?").
2. **AI Synthesis:** The system utilizes the Gemini Neuromorphic Kernel to generate initial factors, SWOT analysis, and comparison tables.
3. **Weight Calibration:** Users can adjust weights for each factor to reflect their specific priorities.
4. **Verbatim Analysis:** Review the generated "Tiebreaker Logic Report" and confidence metrics.
5. **Final Export:** Save the decision trace for archival or presentation.

## 📄 License

SPDX-License-Identifier: Apache-2.0
