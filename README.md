# 🔐 Cypher Vault

> A zero-knowledge password manager built with Next.js 16. Secrets are encrypted client-side — the server never sees your plaintext.

![Version](https://img.shields.io/badge/version-0.1.0-6c63ff?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-private-gray?style=flat-square)

---

## Features

- 🔑 **Key vault** — Primary & recovery key pairs with rotation support. Private keys never leave the client unencrypted.
- 📁 **Folders** — Organize vault entries into folders with soft-delete (`deletedAt`) for safe recovery.
- 🧩 **Encrypted payloads** — PGP-encrypted payload per item (login, password, TOTP, notes) with payload versioning.
- ⭐ **Favorites & search** — Mark items as favorite. Title & URL stored in clear for server-side search.
- 🛡️ **Auth via better-auth** — Session management, OAuth accounts, and email verification out of the box.
- 🌗 **Themes** — Light/dark mode via `next-themes`. UI built with Radix UI + shadcn.

---

## Tech Stack

| Layer     | Technology                 |
| --------- | -------------------------- |
| Framework | Next.js 16 (App Router)    |
| Language  | TypeScript 5               |
| Database  | Neon (Serverless Postgres) |
| ORM       | Drizzle ORM                |
| Auth      | better-auth                |
| UI        | shadcn / Radix UI          |
| Styling   | Tailwind CSS 4             |
| Forms     | React Hook Form + Zod      |

---

## Database Schema

| Table           | Role                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| `user`          | Core identity — name, email, verification status                                         |
| `session`       | Active sessions with IP + user-agent logging                                             |
| `account`       | OAuth providers + password credential storage                                            |
| `verification`  | Time-limited email/device verification tokens                                            |
| `user_keys`     | Encrypted key-pair vault — supports key rotation (`primary` / `recovery`)                |
| `folders`       | Logical groupings for vault entries, with soft-delete                                    |
| `vault_items`   | Entry metadata — title, URL, favorite flag, soft-delete                                  |
| `vault_secrets` | PGP-encrypted payload per item — versioned, `userId`-denormalized for fast authorization |

---

## Encryption Flow

```
Browser → PGP encrypt → API Route → vault_secrets (DB)
```

The server stores **only the ciphertext**. Decryption happens entirely in the browser using the user's private key, which is itself encrypted with a key derived from the user's password (salt stored in `user_keys`).

This means:

- The server never has access to plaintext secrets
- Even a full database leak exposes nothing without the user's master password
- Key rotation is supported without re-encrypting all vault items

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) database (or any Postgres-compatible DB)

### Installation

```bash
# 1. Clone & install
git clone https://github.com/you/cypher-vault
cd cypher-vault
npm install

# 2. Configure environment
cp .env.example .env.local
# → fill in DATABASE_URL, BETTER_AUTH_SECRET, and any OAuth credentials
```

### Database setup

```bash
# Push the schema to your database
npx drizzle-kit push
```

### Development

```bash
npm run dev
# → http://localhost:3000
```

### Production

```bash
npm run build
npm run start
```

---

## Environment Variables

Create a `.env.local` file at the root:

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# OAuth (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Project Structure

```
cypher-vault/
├── app/                  # Next.js App Router pages & layouts
├── components/           # UI components (shadcn + custom)
├── lib/
│   ├── auth.ts           # better-auth configuration
│   ├── db.ts             # Drizzle + Neon client
│   └── schema.ts         # Database schema (Drizzle)
├── drizzle.config.ts     # Drizzle Kit configuration
└── .env.local            # Environment variables (not committed)
```

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Lint with ESLint
```

---

_cypher-vault · v0.1.0 · private · zero-knowledge by design_
