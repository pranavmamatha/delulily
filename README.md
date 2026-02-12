# 🌸 Delulily
[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen?style=for-the-badge&logo=android)](https://github.com/pranavmamatha/delulily/releases/download/latest/delulily.apk)

An AI-powered image transformation app built with React Native and Expo. Upload a photo, choose a creative template, and let the AI generate a stylized version of your image.

## ✨ Features

- **🎨 Template Gallery** — Browse and search a curated collection of AI style templates with a beautiful grid layout, shimmer loading states, and paginated browsing.
- **📸 Image Upload & Generation** — Pick a photo from your gallery, select a template, and submit a job to generate an AI-stylized image via Supabase Edge Functions.
- **👤 Profile & Creations** — View your profile with a gradient header and avatar, browse all your past creations with pagination, and track job statuses in real-time.
- **💾 Download to Gallery** — Save generated images directly to a dedicated "delulily" album on your device.
- **🔐 Google Authentication** — Secure sign-in with Google OAuth powered by Supabase Auth and Expo Secure Store for token persistence.
- **🎭 Animated Splash Screen** — Custom animated splash screen with smooth transitions on app launch.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Expo](https://expo.dev) (SDK 54) + [React Native](https://reactnative.dev) 0.81 |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, typed routes) |
| **Styling** | [NativeWind](https://www.nativewind.dev/) v4 (TailwindCSS for React Native) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Backend & Auth** | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, Edge Functions, RPCs) |
| **Animations** | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| **Runtime** | [Bun](https://bun.sh) |

## 📁 Project Structure

```
delulily/
├── app/                    # Expo Router file-based routes
│   ├── (tabs)/             # Tab navigator (Home & Profile)
│   │   ├── _layout.tsx     # Tab bar configuration
│   │   ├── index.tsx       # Home — template gallery with search
│   │   └── profile.tsx     # Profile — user info & creations grid
│   ├── job/[id].tsx        # Job detail — view generated image & download
│   ├── template/[id].tsx   # Template detail — preview, pick photo, generate
│   ├── login.tsx           # Google sign-in screen
│   └── _layout.tsx         # Root layout — auth guard, splash screen
├── components/
│   ├── AnimatedSplash.tsx   # Custom animated splash screen
│   ├── auth/               # Auth components (Google sign-in button)
│   ├── jobs/               # Job list & job card components
│   ├── profile/            # Profile header & stats
│   └── ui/                 # Shared UI primitives
├── hooks/
│   ├── auth/               # Auth listener hook
│   ├── jobs/               # Job fetching & pagination
│   ├── profile/            # Profile data fetching
│   └── templates/          # Template fetching, search & pagination
├── store/                  # Zustand state stores
│   ├── useAuthStore.ts     # Session & auth state
│   ├── useJobStore.ts      # Jobs list, pagination, status tracking
│   ├── useProfileStore.ts  # User profile data
│   └── useTemplateStore.ts # Templates list, search, pagination
├── lib/
│   └── supabase.ts         # Supabase client with Expo Secure Store adapter
├── supabase/               # Database schema & server-side logic
│   ├── migration/          # SQL migrations (profiles, templates, jobs)
│   ├── rpc/                # Postgres RPC functions (create_job, update_job_status)
│   ├── buckets/            # Storage bucket definitions
│   └── seed/               # Seed data
└── assets/images/          # App icons & splash screen assets
```

## 🚀 Getting Started

### 📥 Download the App

**Android users** can try Delulily right away — no build needed!

[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen?style=for-the-badge&logo=android)](https://github.com/pranavmamatha/delulily/releases/download/latest/delulily.apk)

> **Note:** You may need to enable *Install from unknown sources* in your Android settings to sideload the APK.

---

### 🛠 Build from Source

#### Prerequisites

- [Bun](https://bun.sh) (JavaScript runtime)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`bun install -g expo-cli`)
- A [Supabase](https://supabase.com) project with Auth, Storage, and Edge Functions configured

#### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/delulily.git
   cd delulily
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   Run the SQL migrations against your Supabase project in order:
   - `supabase/migration/users.sql` — Profiles table & auto-creation trigger
   - `supabase/migration/templates.sql` — Templates table
   - `supabase/migration/jobs.sql` — Jobs table with RLS policies
   - `supabase/rpc/rpc.sql` — RPC functions for job creation & status updates
   - `supabase/buckets/bucket.sql` — Storage bucket setup
   - `supabase/seed/seed.sql` — (Optional) Seed templates

5. **Start the development server**

   ```bash
   bunx expo start --clear
   ```

6. **Run on a device**

   - Scan the QR code with [Expo Go](https://expo.dev/go) on your phone
   - Or press `i` for iOS Simulator / `a` for Android Emulator

## 📝 License

This project is private and not currently licensed for public distribution.
