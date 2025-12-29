# AI Quiz Generator 🧠

Transform your study notes into interactive quizzes powered by Claude AI.

## Features

- 📝 Paste any study material (notes, textbook excerpts, lectures)
- 🤖 AI generates multiple-choice quiz questions
- ✅ Take the quiz and get instant feedback
- 💡 See explanations for each answer
- 🎨 Beautiful, modern dark theme

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your API key

Create a file called `.env.local` in the project root:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from [console.anthropic.com](https://console.anthropic.com)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - quiz app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-app.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your `quiz-app` repository
4. **IMPORTANT**: Click "Environment Variables" before deploying
5. Add your API key:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-actual-key-here`
6. Click "Deploy"

Your app will be live in about 1-2 minutes!

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Anthropic Claude API](https://docs.anthropic.com/) - AI quiz generation

## Project Structure

```
quiz-app/
├── src/
│   └── app/
│       ├── api/
│       │   └── generate-quiz/
│       │       └── route.js    # API endpoint for Claude
│       ├── globals.css         # Tailwind imports
│       ├── layout.js           # Root layout
│       └── page.js             # Main quiz UI
├── .env.example                # Example environment variables
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Ideas for V2

- 📊 Difficulty selector (Easy/Medium/Hard)
- ❓ More question types (True/False, fill-in-the-blank)
- 💾 Save quiz history with localStorage
- 📄 PDF upload support
- 🔄 Spaced repetition for missed questions

---

Built with ❤️ by Samson
