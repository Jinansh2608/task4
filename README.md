# THE SORCERER’S CIPHER — Doom’s Hero Archive

A polished, responsive, website-based interactive puzzle game inspired by Marvel superheroes and Doctor Doom. Built for first-year engineering students and team-based puzzle events (3–4 players, 20 minutes, 100 points max).

![Doctor Doom Archive](https://img.shields.io/badge/SECURITY-LATVERIAN%20VAULT-emerald)
![Score](https://img.shields.io/badge/MAX%20SCORE-100%20POINTS-gold)
![Duration](https://img.shields.io/badge/DURATION-20%20MINUTES-blue)
![Sets](https://img.shields.io/badge/SETS-A%20%7C%20B%20%7C%20C%20%7C%20D-teal)

---

## 🎮 Game Specifications

- **Team Size**: 3–4 players
- **Total Duration**: 20 minutes (persisted countdown timer with 5-minute and 1-minute visual alerts)
- **Question Sets**: 4 selectable question sets (**Set A**, **Set B**, **Set C**, **Set D**)
- **Hero Files**: 7 files per set (Files 01–04 Easy, Files 05–07 Medium)
- **Hero Bank**: 8 heroes per set (7 correct, 1 decoy)
- **Power Sequences**: 4 chained transformation challenges per set
- **The Doom Lock**: 1 master 4-digit cipher derived via deterministic extraction
- **Maximum Score**: Exactly 100 points

---

## 🏆 Scoring System (100 Points Total)

| Phase | Breakdown | Points |
|---|---|---:|
| **Hero Files 01–04** (Easy) | Prediction: 3 pts • Identity: 2 pts (×4 files) | 20 pts |
| **Hero Files 05–07** (Medium) | Prediction: 5 pts • Identity: 5 pts (×3 files) | 30 pts |
| **Power Sequences Q1–Q4** | Chained Output: 10 pts each (×4 questions) | 40 pts |
| **Doom Lock** | 4-digit decryption cipher | 10 pts |
| **Total Maximum Score** | | **100 pts** |

> **Anti-Cheat & Reliability Safeguards:**
> - Revisiting previously solved puzzles **never** awards duplicate points.
> - Getting a prediction right earns prediction points immediately. If hero identity is incorrect, players can retry identity selection without redoing prediction.
> - The total score is capped at 100.
> - Progress and timer are persisted in browser `localStorage`.

---

## 🧩 Doom Lock Extraction Rule

A single, deterministic extraction rule applies across all sets:

> **"For each Power Sequence, take the largest number in its final output and extract its last digit. Concatenate the four digits in Q1–Q4 order."**

- **Set A**: `4795`
- **Set B**: `6867`
- **Set C**: `1849`
- **Set D**: `8721`

---

## 🛠️ Technology Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS** (Doctor Doom dark aesthetic: nearly black, charcoal, metallic emerald green `#10b981`, antique gold `#d4af37`)
- **Framer Motion** (smooth holographic transitions, scanlines, and badge animations)
- **Lucide React** (cybernetic and tactical icons)
- **Canvas-Confetti** (celebration effects upon victory)
- **Vitest** (comprehensive unit test suite verifying all 28 Hero File predictions, 16 Power Sequences, Doom Lock derivation, scoring, and parsers)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended; v23 supported)
- npm

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd task4
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser at the URL shown in terminal (typically `http://localhost:5173`).

---

## 🧪 Running Automated Tests

Run the full Vitest suite:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

---

## 📦 Building for Production

Compile TypeScript and build the optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🛡️ Organizer Tools & Answer Key

The application contains an organizer console protected by a clearance code:
- Click the **Gear icon** in the top-right navigation bar.
- Authorization Key: `DOOM2026`
- **Features**:
  - Full classified answer key for all four sets (Hero identities, rules, test answers, Power Sequences, Doom Lock codes).
  - One-click session reset with double confirmation.
  - Zero leakage to regular players during normal gameplay.
