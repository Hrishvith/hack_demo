# ⚡ AgentOps Dashboard

**Multi-Agent AI System for Autonomous Software Development Lifecycle Management**

A futuristic, production-grade operations dashboard built with React, Vite, TypeScript, TailwindCSS, and Framer Motion.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
agentops/
├── index.html                    # Entry HTML with Google Fonts
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── AgentOpsDashboard.jsx         # 🎯 Main component (all-in-one)
└── src/
    ├── main.tsx                  # React entry point
    └── index.css                 # Global styles + Tailwind directives
```

---

## 🧩 Features

### Pages
| Page | Description |
|------|-------------|
| **Dashboard** | Stats overview, charts (task completion rate, agent performance) |
| **Agents** | Real-time monitor for all 6 AI agents with progress bars |
| **Tasks** | Task execution panel with live terminal logs + agent activity |
| **Repositories** | Connected GitHub repos with branch, commit, PR info |
| **Activity Logs** | Filterable terminal-style log viewer |
| **Settings** | System configuration toggles |

### AI Agents
- 🧠 **Planner Agent** — Decomposes tasks into subtasks
- 💻 **Coder Agent** — Edits code files to implement fixes
- 🧪 **Tester Agent** — Generates and runs unit tests
- 👁 **Reviewer Agent** — Reviews code quality and security
- 💬 **Communicator Agent** — Creates GitHub PRs
- 🗄 **Memory Agent** — Manages codebase vector index

### Tech Stack
- **React 18** + **TypeScript**
- **Vite** — lightning-fast dev server
- **TailwindCSS** — utility-first styling
- **Framer Motion** — page transitions, agent animations
- **Recharts** — area + bar charts
- **Lucide React** — icon system
- **IBM Plex Sans/Mono** — typography

---

## 🎨 Design

- Deep dark theme (`#070b0f` base)
- Subtle grid background
- Per-agent color system with glow effects
- Terminal-style log viewer with color-coded agent output
- Animated progress bars and status indicators
- Collapsible sidebar
- Responsive layout (mobile-friendly)
