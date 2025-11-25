# Supabase Web Application

A modern, real-time web application built with React, TypeScript, Vite, and Supabase. Features authentication, real-time data synchronization, and a beautiful dark mode UI.

## ✨ Features

- 🔐 **Authentication** - Email/password signup and login with Supabase Auth
- ⚡ **Real-time Sync** - Live updates across multiple browser sessions
- 🎨 **Premium UI** - Dark mode with glassmorphism effects and smooth animations
- 🔒 **Row Level Security** - Secure data access with Supabase RLS policies
- 📱 **Responsive Design** - Works beautifully on all devices

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → API** and copy:
   - Project URL
   - Anon/Public Key

### 3. Configure Environment Variables

Update the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the sidebar
3. Open the `SUPABASE_SETUP.md` file in this project
4. Copy all the SQL commands and run them in the SQL Editor

This will create the `todos` table with proper security policies and enable real-time updates.

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📖 Usage

1. **Sign Up** - Create a new account with your email and password
2. **Add Todos** - Create todo items in the dashboard
3. **Real-time Test** - Open the app in multiple browser tabs and watch updates sync in real-time!
4. **Toggle & Delete** - Mark todos as complete or delete them

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx       # Login form
│   │   └── Signup.tsx      # Signup form
│   └── ProtectedRoute.tsx  # Route guard
├── contexts/
│   └── AuthContext.tsx     # Auth state management
├── hooks/
│   └── useSupabase.ts      # Custom Supabase hooks
├── lib/
│   └── supabase.ts         # Supabase client config
├── pages/
│   └── Dashboard.tsx       # Main app page
├── App.tsx                 # Router setup
├── main.tsx                # App entry point
└── index.css               # Design system
```

## 🎨 Design System

The app uses a custom design system with:
- **Inter** font family from Google Fonts
- Dark mode color palette with vibrant accent colors
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- CSS custom properties for easy theming

## 🔧 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security
- **React Router** - Client-side routing

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security

- Row Level Security (RLS) ensures users can only access their own data
- Environment variables keep sensitive credentials secure
- Authentication tokens are managed automatically by Supabase

## 🌟 Next Steps

- Add more features (notes, categories, due dates)
- Implement email confirmation
- Add social auth providers (Google, GitHub)
- Deploy to production (Vercel, Netlify, etc.)
- Add offline support with service workers

## 📚 Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

Built with ❤️ using Supabase
