# 🔥 Profile Roaster (ProfileToast v3.0)

A brutally savage, AI-powered web application that judges your digital footprint. Paste a link to your LinkedIn, GitHub, Instagram, Twitter, or Portfolio, and let the AI tear down your life choices—before actually giving you solid advice to fix them.

Zero mercy. Actually helpful.

## ✨ Features

* **5 Unforgiving Modes:** Tailored roasts for LinkedIn, GitHub, Instagram, X (Twitter), and personal dev portfolios.
* **AI-Powered Savagery:** Uses OpenRouter and GPT-4o to generate hyper-specific, painfully accurate psychological and professional teardowns based purely on the vibe of a URL.
* **Structured Feedback:** Every roast delivers the pain, a creative score (e.g., "Corporate Clown: 4/10"), 5 brutal but actionable improvements, and one backhanded compliment.
* **Slick UI/UX:** Built with React, featuring an animated particle background, floating orbs, and terminal-inspired typography.
* **One-Click Copy:** Easily copy the devastating roast to your clipboard to humble your friends.

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Icons:** Lucide React
* **Styling:** Custom CSS (Syne & Syne Mono fonts)
* **AI Integration:** OpenRouter API (openai/gpt-4o)

## 🚀 Local Setup

To run this monstrosity on your local machine, follow these steps:

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/YOUR-USERNAME/profile-roaster.git
cd profile-roaster
\`\`\`

**2. Install dependencies**
Make sure you have Node.js installed, then run:
\`\`\`bash
npm install
# or yarn install / pnpm install
\`\`\`

**3. Set up your environment variables**
Create a `.env` file in the root directory and add your OpenRouter API key:
\`\`\`env
VITE_OPENROUTER_API_KEY=your_api_key_here
\`\`\`

**4. Start the development server**
\`\`\`bash
npm run dev
\`\`\`
Your app will be running at `http://localhost:5173`.

## 🌐 Deployment

This project is perfectly set up to be deployed on Vercel. 

1. Push your code to GitHub.
2. Go to your Vercel dashboard and click **Add New** > **Project**.
3. Import your GitHub repository.
4. In the environment variables section, add `VITE_OPENROUTER_API_KEY` and your secret key.
5. Click **Deploy**.

## 🤝 Contributing

Found a bug? Want to make the AI even meaner? Feel free to open an issue or submit a pull request. 

## 📝 License

MIT License. Do whatever you want with it. 

---
*Built with no mercy by Addy.*
