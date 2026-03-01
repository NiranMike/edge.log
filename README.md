This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


<!------------------------- AUTHENTICATION ----------------------->


# EdgeLog Auth Setup Guide

## 1. Install packages

```bash
npm install next-auth@beta @auth/prisma-adapter @prisma/client bcryptjs zod react-hook-form @hookform/resolvers
npm install -D prisma @types/bcryptjs
```

## 2. Environment variables

Create `.env.local` (never commit):

```env
# PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/edgelog?schema=public"

# Auth.js secret — generate with: openssl rand -base64 32
AUTH_SECRET="your-generated-secret-here"

# Google OAuth — get from console.cloud.google.com
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Only needed in production (auto-detected on Vercel)
# AUTH_URL="https://yourdomain.com"
```

## 3. Google OAuth Console setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production:  `https://yourdomain.com/api/auth/callback/google`
4. Copy Client ID → `AUTH_GOOGLE_ID`
5. Copy Client Secret → `AUTH_GOOGLE_SECRET`

## 4. Database setup

```bash
# Copy schema.prisma → prisma/schema.prisma, then:
npx prisma migrate dev --name init
npx prisma generate

# Optional: inspect data in browser
npx prisma studio
```

## 5. File structure

```
/  (project root)
├── auth.ts                              ← Full server config (Node runtime)
├── auth.config.ts                       ← Edge-safe config (middleware uses this)
├── middleware.ts
│
├── prisma/
│   └── schema.prisma
│
├── lib/
│   ├── db.ts
│   ├── validations/
│   │   └── auth.ts                      ← (auth.validations.ts)
│   └── actions/
│       └── auth.actions.ts
│
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts                     ← (route.ts)
│   └── (auth)/
│       ├── login/page.tsx               ← (LoginPage.tsx)
│       ├── register/page.tsx            ← (RegisterPage.tsx)
│       └── logout/page.tsx              ← (LogoutPage.tsx)
│
└── components/auth/
    ├── AuthShell.tsx
    ├── AuthField.tsx
    ├── GoogleButton.tsx
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    └── LogoutClient.tsx                 ← extract bottom of LogoutPage.tsx
```

## 6. Using the session in Server Components / Actions

```ts
import { auth } from "@/auth";

// Server Component
const session = await auth();
if (!session?.user) redirect("/login");
console.log(session.user.id);   // always typed
console.log(session.user.email);
console.log(session.user.image); // Google avatar or null

// Server Action
export async function someAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthenticated");
}
```

## 7. Account linking behaviour

| Scenario | Result |
|---|---|
| New Google user | Creates User + Account rows automatically |
| New credentials user | Creates User row, hashes password |
| Google sign-in, email matches existing credentials user | Links Google Account to existing User — no duplicate user |
| Credentials sign-in, user only has Google account | "Invalid credentials" error (no passwordHash) |