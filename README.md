# Sport Match - Badminton Matchmaking Platform MVP

A production-ready MVP for a badminton matchmaking platform connecting players with hosts. Built with a modern monorepo structure using TypeScript, NestJS, Expo/React Native, and PostgreSQL.

## 🎯 Project Overview

**Sport Match** is a marketplace-like platform that connects:

- **Players (Demand Side)**: Browse and join badminton sessions
- **Hosts (Supply Side)**: Create and manage badminton sessions

### MVP Scope

This is a focused MVP for **Nha Trang, Khanh Hoa, Vietnam** with architecture designed to scale.

**Included:**

- User authentication (mock OTP placeholder)
- Session browsing and filtering
- Join/leave sessions
- Attendance confirmation
- Host session management
- Role-based access

**Not Included (MVP):**

- Payment integration
- Chat/messaging
- Rating/review system
- Push notifications
- Subscription system
- Tournament mode

## 📦 Monorepo Structure

```
sport_match/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules
│   │   │   ├── common/      # Shared utilities
│   │   │   └── main.ts      # Entry point
│   │   ├── drizzle/         # Database schema & migrations
│   │   └── package.json
│   │
│   └── mobile/              # Expo React Native app
│       ├── src/
│       │   ├── screens/     # Screen components
│       │   ├── components/  # Reusable UI components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── store/       # Zustand state management
│       │   └── utils/       # Utilities & API client
│       └── package.json
│
├── packages/
│   ├── shared/              # Shared types & constants
│   ├── typescript-config/   # TypeScript configuration
│   ├── eslint-config/       # ESLint rules
│   └── ui/                  # [Optional] Shared UI components
│
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json             # Root scripts

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment files
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env

# Update .env files with your configuration
```

### Database Setup

```bash
# Create database and run migrations
pnpm db:setup

# Seed test data
pnpm db:seed
```

### Development

```bash
# Start all services in watch mode
pnpm dev

# Or individually:
# Backend
cd apps/api && pnpm dev

# Mobile
cd apps/mobile && pnpm start
```

## 📱 Mobile App (Expo)

### Features

**Player Flows:**

- Browse available badminton sessions
- Filter by location, date, skill level
- View session details (venue, time, participants)
- Join sessions
- Confirm attendance
- Track joined sessions

**Host Flows:**

- Create badminton sessions
- Set venue, date, time, skill level, max players
- View session participants
- Manage attendance
- Remove players if needed

**Core Screens:**

- Login
- Home (Browse Sessions)
- Session Detail
- My Sessions
- Host Dashboard
- Create Session
- Manage Session
- Profile

### Tech Stack

- **Framework:** Expo 50, React Native 0.73
- **Navigation:** React Navigation + Expo Router
- **State Management:** Zustand + TanStack Query
- **API Communication:** Axios
- **Validation:** zod (client-side)
- **Styling:** React Native StyleSheet

### Running Mobile App

```bash
cd apps/mobile

# Development server
pnpm start

# iOS
pnpm ios

# Android
pnpm android

# Web (preview)
pnpm web
```

## 🔌 Backend API (NestJS)

### Features

- RESTful API with clean architecture
- Class-based validation with class-validator
- Drizzle ORM for database
- Mock authentication (OTP placeholder)
- Role-based access control
- Error handling & logging
- Database seeding

### API Modules

- **Auth:** Mock login, token validation
- **Users:** User profile management
- **Hosts:** Host profile creation and management
- **Venues:** Venue listing and details
- **Sessions:** Session CRUD, join/leave, status management
- **Participants:** Participant management, attendance tracking
- **Health:** Health check endpoint

### Key Endpoints

```
# Auth
POST   /auth/mock-login          # Login with phone
GET    /auth/me                  # Get current user

# Sessions
GET    /sessions                 # List sessions (with filters)
GET    /sessions/:id             # Get session detail
POST   /sessions                 # Create session (host only)
PATCH  /sessions/:id             # Update session (host only)
POST   /sessions/:id/join        # Join session
POST   /sessions/:id/leave       # Leave session
POST   /sessions/:id/confirm-attendance  # Confirm attendance
GET    /sessions/host/me         # Get host's sessions

# Venues
GET    /venues                   # List venues
GET    /venues/:id               # Get venue detail

# Users
GET    /users/me                 # Get current user profile
PATCH  /users/me                 # Update profile

# Hosts
GET    /hosts/me                 # Get host profile
POST   /hosts/me/create-profile  # Create host profile
PATCH  /hosts/me                 # Update host profile
```

### Running Backend

```bash
cd apps/api

# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start:prod
```

## 🗄️ Database Schema

### Core Models

- **User:** Core user entity with phone-based auth
- **HostProfile:** Extends User with hosting capabilities
- **Venue:** Physical location for sessions
- **GameSession:** Badminton session instance
- **SessionParticipant:** Join relationship with attendance status

### Database Design Highlights

- Proper foreign key relationships with CASCADE deletes
- Unique constraints (email per user, one profile per host)
- Composite indexes for common queries
- Timestamps (createdAt, updatedAt) on all entities

## 📦 Shared Package

Centralized type definitions and constants used across mobile and API:

- **Domain Types:** UserRole, SkillLevel, SessionStatus, AttendanceStatus
- **DTOs:** API response contracts
- **Constants:** Routes, UI constants, validation rules
- **Utilities:** Date formatting, phone validation, session helpers

## 🔐 Authentication

**Current (MVP):**

- Mock phone-based login (no real OTP)
- JWT tokens with 30-day expiration
- AsyncStorage for mobile token persistence

**Future:**

- Real OTP via SMS
- Refresh token rotation
- Social login options

## 🎨 UI/UX

### Design Principles

- Clean, minimal interface
- Clear call-to-action buttons
- Status indicators (badges)
- Loading states for all async operations
- Empty states with helpful messages
- Error handling with user-friendly messages

### Component Architecture

- Small, focused, reusable components
- Props-based composition
- Consistent styling patterns
- Accessible color contrast

## 📊 Data Flow

```
Mobile App
  ↓
Axios API Client (with auth interceptor)
  ↓
NestJS REST API
  ↓
Drizzle ORM
  ↓
PostgreSQL
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

## 🚢 Deployment

### Backend Deployment

1. Build: `pnpm build`
2. Set environment variables
3. Run migrations: `npm run db:migrate`
4. Start: `npm run start:prod`

### Mobile Deployment

- **iOS:** Build via EAS (Expo Application Services)
- **Android:** Build via EAS or local Android Studio

```bash
# Using EAS
eas build --platform ios
eas build --platform android
```

## 📝 Environment Variables

### Backend (.env)

```
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/sport_match_dev
JWT_SECRET=your_secret_key_here
API_PORT=3000
```

### Mobile (.env)

```
API_URL=http://localhost:3000
```

## 📚 Code Style & Conventions

- **Language:** TypeScript with strict mode
- **Formatting:** Consistent indentation (2 spaces)
- **Naming:** camelCase for variables/functions, PascalCase for classes/components
- **Comments:** Only where clarity is needed, not obvious code
- **Error Handling:** Try-catch with meaningful error messages
- **Async/Await:** Preferred over callbacks/promises

## 🐛 Common Issues & Troubleshooting

### Database Connection Failed

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `pnpm db:setup` if schema not created

### Mobile App Can't Reach API

- Ensure API is running on port 3000
- Check API_URL in mobile .env
- On Android emulator, use `10.0.2.2` instead of `localhost`

### Dependencies Not Installing

- Clear cache: `pnpm store prune`
- Delete node_modules: `rm -rf node_modules pnpm-lock.yaml`
- Reinstall: `pnpm install`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code conventions
3. Test changes locally
4. Submit pull request

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for badminton enthusiasts**
