# 🎮 GameBuddy — AI Gaming Companion

A full-stack conversational AI chatbot for gamers. Get help with builds, walkthroughs, tips, and lore across multiple game channels — powered by Google Gemini AI.

![GameBuddy Screenshot](https://placeholder.com/screenshot)

## ✨ Features

- **5 Game Channels** — Elden Ring, Minecraft, Valorant, Fortnite, and a free Any Game tab
- **Streaming AI Responses** — token-by-token streaming just like ChatGPT
- **Per-game AI Personality** — each channel has a tailored system prompt and expertise
- **Google OAuth** — one-click sign in, no passwords
- **Per-user Chat History** — sessions saved to MongoDB, accessible across devices
- **Markdown Rendering** — AI responses render with proper headers, bold, code blocks
- **Gamer UI** — dark theme with accent colors, custom scrollbar, Rajdhani font

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini 2.0 Flash |
| Auth | Passport.js + Google OAuth 2.0 |
| Sessions | express-session + connect-mongo |
| Deployment | Vercel (client) + Render (server) |

## 📁 Project Structure

```
gaming-buddy/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── chatApi.js      # Axios + SSE streaming calls
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx  # Main chat area
│   │   │   ├── InputBar.jsx    # Message input
│   │   │   ├── LoginPage.jsx   # Google OAuth login screen
│   │   │   ├── MessageBubble.jsx # Chat bubbles with markdown
│   │   │   └── Sidebar.jsx     # Game tabs + session history
│   │   ├── hooks/
│   │   │   ├── useAuth.js      # Auth state + login/logout
│   │   │   └── useStream.js    # SSE streaming hook
│   │   ├── stores/
│   │   │   └── useChatStore.js # Zustand global state
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     # Node.js + Express backend
    ├── config/
    │   └── passport.js         # Google OAuth strategy
    ├── models/
    │   ├── Session.js          # Chat session schema
    │   └── User.js             # User schema
    ├── routes/
    │   ├── auth.js             # /auth/google, /auth/me, /auth/logout
    │   ├── chat.js             # POST /api/chat (SSE streaming)
    │   └── sessions.js         # GET/DELETE /api/sessions
    ├── services/
    │   └── geminiService.js    # Gemini API wrapper
    └── index.js
```

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Google Gemini API key
- Google OAuth credentials

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/gaming-buddy.git
cd gaming-buddy
```

### 2. Set up the server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://your_direct_connection_string
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
SESSION_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Open `http://localhost:5173`

## 🌐 Deployment

### Server → Render

1. New Web Service → connect GitHub repo
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node --env-file=.env index.js`
5. Add all environment variables from `server/.env`
6. Set `NODE_ENV=production`
7. Set `GOOGLE_CALLBACK_URL` to your Render URL

### Client → Vercel

1. New Project → import GitHub repo
2. Root Directory: `client`
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
4. Deploy

### Post-deployment

- Update `CLIENT_URL` on Render to your Vercel URL
- Add the Render callback URL to Google OAuth authorized redirect URIs

## 🔑 Getting API Keys

### Gemini API Key
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click "Create API Key" → "Create API key in new project"
3. Copy the key

### Google OAuth Credentials
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. APIs & Services → OAuth consent screen → External
4. Credentials → Create Credentials → OAuth client ID
5. Application type: Web application
6. Add authorized redirect URIs for local and production
7. Copy Client ID and Client Secret

### MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Database Access → Add user
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Connect → Drivers → copy connection string

## ⚠️ Known Limitations

- Render free tier spins down after 15 min inactivity — first request takes ~30s to wake up
- Gemini free tier has rate limits (15 RPM, 1M tokens/day)
- Chat history is per-user via Google account — no guest history

## 📄 License

MIT