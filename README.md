# AI Live Chat Agent

A premium, AI-powered customer support chat application built with React, Node.js, and SQLite.

## Features
- **Real-time AI Chat**: Integrated with OpenRouter API.
- **Smart Knowledge**: Seeded with domain knowledge about a fictional Tech Store.
- **Persistent Conversations**: Uses SQLite to save all messages and sessions.
- **Premium UI**: Modern design with animations, markdown support, and quick-question chips.
- **Context Aware**: Remembers recent conversation history for better AI replies.

---

## 🛠 Setup & Installation

Follow these steps to get the project running locally.

### 1. Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **OpenRouter API Key** (Get one at [openrouter.ai])

### 2. Quick Start (Unified Mode)

This is the fastest way to run the project. It builds the frontend and serves it via the backend on a single port.

1. **Navigate to the Root folder**: `spur-task`
2. **Setup your Environment**:
   - Create `backend/.env` (use `backend/.env.example` as a template).
   - Add your `OPENROUTER_API_KEY` and `LLM_MODEL`.
3. **Run the following command**:
   ```bash
   npm run build && npm run start
   ```
4. **Open your browser**: [http://localhost:3001](http://localhost:3001)

---

## 🚀 Deployment (Render)

To deploy both frontend and backend together as a single service on Render:

1. **Create a New Web Service** on Render.
2. **Connect your Repository**.
3. **Configure Settings**:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Root Directory**: (Leave blank)
4. **Environment Variables**:
   - `OPENROUTER_API_KEY`: Your API key.
   - `LLM_MODEL`: Your preferred model.
   - `NODE_ENV`: `production`

---

## 📂 Project Structure
- `backend/`: Express server, SQLite database, and LLM logic.
- `frontend/`: React application with Vite, premium CSS, and API services.
- `chat.db`: SQLite database file (created automatically upon first message).

---

## 🧪 Testing the AI
Try asking the following to test the domain knowledge:
- "What is your return policy?"
- "What electronic products do you sell?"
- "What are your support hours?"
- "Do you ship to the UK?"
