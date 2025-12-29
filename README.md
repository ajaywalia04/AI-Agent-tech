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

### 2. Implementation Steps

#### Step A: Backend Configuration
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your details:
   - `OPENROUTER_API_KEY`: Your real API key.
   - `LLM_MODEL`: The model you want to use .
   - `PORT`: (Optional) Defaults to `3001`.

4. Install dependencies and start the server:
   ```bash
   npm install
   npm run dev
   ```
   *The backend will be running at `http://localhost:3001`.*

#### Step B: Frontend Configuration
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be running at `http://localhost:5173`.*

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

Render will automatically build the frontend, build the backend, and start the server which serves both the API and the static frontend files.

---

## 📂 Project Structure
- `backend/`: Express server, SQLite database, and LLM logic.
- `frontend/`: React application with Vite, Tailwind-like CSS, and API services.
- `chat.db`: SQLite database file (created automatically upon first message).

---

## 🧪 Testing the AI
Try asking the following to test the domain knowledge:
- "What is your return policy?"
- "What electronic products do you sell?"
- "What are your support hours?"
- "Do you ship to the UK?"
