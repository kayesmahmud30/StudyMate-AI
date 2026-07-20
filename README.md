# StudyMate AI — Client (Frontend)

StudyMate AI is a personalized learning companion that enables users to build structured, AI-powered study roadmaps, track daily study milestones, access curated learning resources, and monitor overall study analytics.

This repository hosts the **Next.js App Router client application**, built with React 19, TypeScript, Tailwind CSS, Better Auth, and Recharts.

- **Live Application Link**: [https://study-mate-ai-taupe.vercel.app](https://study-mate-ai-taupe.vercel.app)
- **Live API Link**: [https://study-mate-ai-server-gamma.vercel.app](https://study-mate-ai-server-gamma.vercel.app)
- **GitHub Repository**: [https://github.com/kayesmahmud30/StudyMate-AI](https://github.com/kayesmahmud30/StudyMate-AI)

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS + [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Email & Password, Google OAuth)
- **State & Forms**: [React Hook Form](https://react-hook-form.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Lottie React](https://github.com/gamerson/lottie-react)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Charts**: [Recharts](https://recharts.org/)
- **Toasts**: [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## ⚙️ Environment Variables (`.env`)

To run the client, create a `.env` file in the root of the `StudyMate-Client` directory. Below is the configuration structure containing both development (Localhost) and production settings:

```env
# --- Application URLs ---
# Localhost Development (Active by Default)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:8000

# Production Deployment (Commented)
# BETTER_AUTH_URL=https://your-production-client-url.vercel.app
# NEXT_PUBLIC_BETTER_AUTH_URL=https://your-production-client-url.vercel.app
# NEXT_PUBLIC_SERVER_URL=https://your-production-server-url.vercel.app

# --- Better Auth Secret ---
BETTER_AUTH_SECRET=your_32_bytes_better_auth_secret_here

# --- OAuth credentials (Google) ---
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# --- Database ---
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?appName=Cluster0

# --- Cloudinary (Image Uploads) ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18+ recommended) and npm/pnpm/yarn installed.

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd StudyMate-Client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project and populate it with the key-value pairs listed in the **Environment Variables** section above.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Repository Structure

```
StudyMate-Client/
├── public/                 # Static assets, fonts, icons
└── src/
    ├── app/                # Next.js App Router Page components
    │   ├── api/            # API endpoints (e.g. Upload, Auth handlers)
    │   ├── auth/           # Login & Signup pages
    │   ├── components/     # Reusable layout and core feature components
    │   ├── dashboard/      # User dashboard, roadmaps, and scheduling
    │   ├── explore/        # Community library and explore route
    │   ├── profile/        # User profile page
    │   ├── globals.css     # Global styles & tailwind configuration
    │   ├── layout.tsx      # Root HTML structure and providers wrapping
    │   └── providers.tsx   # Client contexts (Auth, Theme, Toasts)
    └── lib/                # Shared utilities, Auth clients, and TypeScript types
```

---

## 📦 Scripts

- `npm run dev`: Runs Next.js dev server with Turbopack fast compilation.
- `npm run build`: Compiles optimized production bundle.
- `npm run start`: Runs the built production server locally.
- `npm run lint`: Performs ESLint check for code quality issues.
