# 🚀 SEO Analyzer Pro

**SEO Analyzer Pro** is an AI-powered web application that provides instant, comprehensive SEO audits for any URL. Paste a link and receive a detailed score out of 100, complete with a breakdown of meta tags, headings, Open Graph details, JSON-LD Schema, and AI-generated repair recommendations. 

All features are currently fully accessible and free, with a rate limit of 5 audits per day per user.

---

## 🌟 Key Features

- **Instant Audits:** Submits a server-side scrape using `cheerio` to fetch crucial SEO indicators (Title, Meta, Links, Robots, Schemas, etc.) and calculate a weighted SEO score.
- **AI-Powered Diagnostics:** Leverages the **Google Gemini-2.0-Flash** AI model to analyze the scraped HTML context and generate exactly 5 high-priority, actionable SEO fix recommendations.
- **Detailed Insights Dashboard:**
  - Animated SEO score ring based on the audit's output.
  - Granular, tabbed breakdowns of elements: Meta tags, Headings (H1-H6 tree), Open Graph/Twitter Cards, Schema Markup, Links & Images stats, and specific site Issues.
- **User Dashboard & History:** Keep track of your past audits securely with the user dashboard.
- **Authentication:** Supported via **NextAuth.js** (integrable with Google, GitHub, and Magic Links).
- **Export Data:** Download comprehensive audit reports directly as a CSV to share with clients or developers.

---

## 💻 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database & ORM:** PostgreSQL alongside [Prisma](https://www.prisma.io/) (`@prisma/adapter-pg`)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (v4)
- **AI Integration:** Google Gemini API (`@google/genai`)
- **State Management:** URL state management via [`nuqs`](https://nuqs.47ng.com/)
- **Scraping:** Server-side parsing with [`cheerio`](https://cheerio.js.org/)

---

## 📂 Project Structure

```text
seo-analyzer-pro/
├── app/               # Next.js App Router (pages: /, /login, /dashboard, /analyze)
├── components/        # Reusable UI components (shadcn/ui, score rings, tabs, etc.)
├── lib/               # Core logic (scraper, score calculators, AI logic, NextAuth config)
├── prisma/            # Database schema models (User, Audit)
└── public/            # Static assets
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- API Keys: Google Auth, GitHub OAuth, and Google Gemini API

### 1. Installation

Navigate to the `seo-analyzer-pro` directory and install the required dependencies:

```bash
cd seo-analyzer-pro
npm install
```

### 2. Environment Variables

Create a `.env` file at the root of the `seo-analyzer-pro` directory and add the necessary environment variables required for NextAuth, the Database connection, and Gemini AI:

```env
# Authentication Keys
NEXTAUTH_SECRET="your-next-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Database & Prisma
DATABASE_URL="postgres://user:password@localhost:5432/yourdbname"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Initialization

Generate the Prisma Client and push your schema to the active PostgreSQL database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Running the App

Start the Next.js development server:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deployment

The project is highly optimized for serverless deployments on platforms like **Vercel**. 
1. Link your repository or this specific directory to your Vercel continuous deployment platform.
2. Add the `.env` variables under your project settings' Environment Variables tab.
3. Configure the **Build Command** to generate the Prisma client during construction:
   ```bash
   prisma generate && next build
   ```
4. Deploy to production!
