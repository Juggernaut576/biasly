# Clerk Authentication Implementation

## Goal

Add `@clerk/nextjs` authentication to the biasly news analysis application, including ClerkProvider configuration, middleware route protection setup, custom sign-in / sign-up routes or Clerk modal flows, and header user controls (`SignedOut` login button, `SignedIn` user button / avatar).

## Skills read

- `AGENTS.md` — Section 3 Skills rules & architecture guidelines
- `.agents/skills/clerk` — Clerk router & version detection
- `.agents/skills/clerk-setup` — Next.js `@clerk/nextjs` installation, environment setup, ClerkProvider placement in `<body>`, and middleware configuration
- `.agents/skills/clerk-nextjs-patterns` — Next.js App Router server vs client auth patterns (`await auth()`, `SignedIn`, `SignedOut`, `UserButton`, `SignInButton`)

## Existing code inspected

- `package.json` — Next.js `16.2.10`, React `19.2.4` (requires current `@clerk/nextjs` v6/v7)
- `app/layout.tsx` — Root layout where `<ClerkProvider>` must be placed inside `<body>`
- `components/layout/header.tsx` — Main navbar where `Subscribe`/`Login` buttons will be integrated with `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, and `<UserButton>`
- `.env.local` — environment file for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

## Decisions or assumptions

- **Package**: Install `@clerk/nextjs` using `npm install @clerk/nextjs`.
- **Environment Keys**: Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`. Allow Keyless fallback or default development placeholder keys if Dashboard keys are not pre-injected.
- **Provider Placement**: Place `<ClerkProvider>` inside the `<body>` element in `app/layout.tsx` (as specified in `clerk-setup` skill for React 19 / Next.js).
- **Middleware**: Create `middleware.ts` in the project root using `clerkMiddleware()` from `@clerk/nextjs/server` with public matcher allowing public access to homepage `/`, `/article/(.*)`, and static assets.
- **Header Auth Controls**:
  - `<SignedOut>`: Display `Subscribe` button and `Login` button wrapped with `<SignInButton mode="modal">`.
  - `<SignedIn>`: Display `Subscribe` button and `<UserButton afterSignOutUrl="/" />`.
- **Auth Routes**: Optional custom sign-in/sign-up page routes at `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` using `<SignIn />` and `<SignUp />` from `@clerk/nextjs` for full-page flows, while defaulting header login to convenient modal sign-in.

## Files to change

### New files
- `middleware.ts` — Clerk middleware for Next.js App Router route protection
- `app/sign-in/[[...sign-in]]/page.tsx` — Optional dedicated sign-in page
- `app/sign-up/[[...sign-up]]/page.tsx` — Optional dedicated sign-up page

### Modified files
- `package.json` — add `@clerk/nextjs` dependency
- `.env.local` — add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and optional auth route env vars
- `app/layout.tsx` — wrap body contents with `<ClerkProvider>`
- `components/layout/header.tsx` — integrate `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, and `<UserButton>`

## Implementation requirements

1. **Dependency Installation**:
   - Install `@clerk/nextjs` via `npm install @clerk/nextjs`.

2. **Environment Configuration (`.env.local`)**:
   - Add Clerk environment variables:
     ```env
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
     ```

3. **Root Layout Provider (`app/layout.tsx`)**:
   - Import `ClerkProvider` from `@clerk/nextjs`.
   - Wrap the contents inside `<body>` with `<ClerkProvider>`:
     ```tsx
     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="en" className={`${poppins.variable} h-full antialiased`}>
           <body className="min-h-full flex flex-col">
             <ClerkProvider>{children}</ClerkProvider>
           </body>
         </html>
       );
     }
     ```

4. **Middleware (`middleware.ts`)**:
   - Create `middleware.ts` using `clerkMiddleware()` from `@clerk/nextjs/server`.
   - Ensure homepage `/`, article details `/article/(.*)`, and static assets are accessible without blocking public visitors.

5. **Header Auth UI (`components/layout/header.tsx`)**:
   - Import `ClerkProvider` components: `SignedIn`, `SignedOut`, `SignInButton`, `UserButton`.
   - Replace static `Login` button:
     - Wrap login button with `<SignedOut><SignInButton mode="modal"><Button variant="outline">Login</Button></SignInButton></SignedOut>`.
     - When signed in, show `<SignedIn><UserButton /></SignedIn>`.

6. **Sign In & Sign Up Pages**:
   - Create `app/sign-in/[[...sign-in]]/page.tsx` rendering `<SignIn />`.
   - Create `app/sign-up/[[...sign-up]]/page.tsx` rendering `<SignUp />`.

## Security requirements

- `CLERK_SECRET_KEY` must strictly remain server-only in `.env.local` and never be prefixed with `NEXT_PUBLIC_` or exposed to client code.
- Public routes (homepage, article details) remain readable to unauthenticated visitors; action routes / protected routes require auth check via `auth()`.

## Acceptance criteria

1. `@clerk/nextjs` package installs without dependency conflicts.
2. App builds and compiles clean (`npm run dev` / `npm run build`).
3. Unauthenticated users can browse `/` and `/article/[id]`.
4. Header displays `Login` button when signed out.
5. Clicking `Login` triggers Clerk modal authentication or redirects to `/sign-in`.
6. Once signed in, header displays the `UserButton` avatar instead of `Login`.
7. User can sign out via `UserButton` menu.

## Checks to run

- `npm run dev` to verify clean build and server startup.
- Browser test at `http://localhost:3000` to verify Header auth controls (`Login` button, `UserButton`).

## Exact manual test steps expected after implementation

1. Run `npm run dev`.
2. Open `http://localhost:3000` in browser.
3. Observe Header right section: verify `Subscribe` and `Login` buttons are visible.
4. Click `Login` button — verify Clerk sign-in modal/page opens.
5. Sign in or create a test user.
6. Observe Header after sign in: verify `UserButton` avatar is displayed.
7. Click `UserButton` avatar and click `Sign Out` — verify user is signed out and `Login` button reappears.
