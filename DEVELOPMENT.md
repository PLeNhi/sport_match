# Development Guide

## Project Setup Checklist

- [x] Monorepo with pnpm workspaces
- [x] Shared types and constants package
- [x] TypeScript and ESLint configuration
- [x] Prisma schema with all core models
- [x] NestJS API with all core modules
- [x] Expo mobile app with navigation
- [x] API client and hooks
- [x] Mock authentication system
- [x] Core UI components

## Next Steps (In Priority Order)

### Phase 1: Polish & Testing

1. [ ] Fix AsyncStorage import in mobile app (may need expo-modules-core)
2. [ ] Add proper error boundaries
3. [ ] Implement session persistence (AsyncStorage)
4. [ ] Add form validation on mobile
5. [ ] Add pull-to-refresh on session lists

### Phase 2: Advanced Features

1. [ ] Real OTP authentication via Twilio/similar
2. [ ] Session filtering UI on mobile
3. [ ] Session edit functionality
4. [ ] Better error messages and user feedback
5. [ ] Session search by title/venue

### Phase 3: Optimization

1. [ ] Add image caching
2. [ ] Optimize queries with pagination
3. [ ] Add offline support
4. [ ] Performance monitoring
5. [ ] Analytics integration

### Phase 4: Production

1. [ ] Security audit
2. [ ] Load testing
3. [ ] Rate limiting
4. [ ] Monitoring/Logging
5. [ ] Backup strategy

## Database Migrations

After schema changes:

```bash
# Create migration
pnpm db:migrate --name your_migration_name

# Reset (local dev only)
pnpm db:reset
```

## API Development

### Adding a New Endpoint

1. Create DTO in module's `dto/` folder
2. Create service method
3. Create controller method
4. Add route to module
5. Update `@sport-match/shared` types if needed
6. Add to mobile API client

### Example: Adding Remove Player Endpoint

✅ Already implemented in `/participants/remove`

## Mobile Development

### Adding a New Screen

1. Create screen component in `src/screens/`
2. Export from `src/screens/index.ts`
3. Add route to navigation stack in `navigation.tsx`
4. Connect to hooks/API client

### Adding a New Hook

1. Create hook file in `src/hooks/`
2. Use TanStack Query for data fetching
3. Use custom hooks for reusability
4. Export from hooks/index.ts (if needed)

## Known Limitations & TODOs

### Backend API

- [ ] TODO: Implement proper JWT guards instead of manual token extraction
- [ ] TODO: Add pagination to list endpoints
- [ ] TODO: Add input sanitization
- [ ] TODO: Add logging/monitoring
- [ ] TODO: Add API rate limiting

### Mobile App

- [ ] TODO: Implement real venue selector (currently placeholder)
- [ ] TODO: Add date/time picker components
- [ ] TODO: Implement session edit functionality
- [ ] TODO: Add participant detail view on host session screen
- [ ] TODO: Implement offline mode
- [ ] TODO: Add analytics
- [ ] TODO: Fix TabIcon component (uses web span element)

### Database

- [ ] TODO: Add database indexing for performance
- [ ] TODO: Add archive strategy for old sessions

### DevOps

- [ ] TODO: Docker setup for API
- [ ] TODO: CI/CD pipeline
- [ ] TODO: Database backup strategy
- [ ] TODO: Deployment guides

## Testing

### Run Tests

```bash
pnpm test
```

### Test Coverage

```bash
pnpm test:cov
```

## Performance Tips

1. Use React.memo for session cards
2. Implement pagination for large lists
3. Cache venue data (changes rarely)
4. Use proper key prop in FlatLists
5. Debounce filters/search

## Debugging

### Backend

```bash
# Enable query logging in Prisma
# Add in prisma/schema.prisma:
# log: ['query', 'error', 'warn'],
```

### Mobile

```bash
# React Query DevTools in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/build/modern/production.js'
```

## Common Development Tasks

### Add a new user role

1. Update `USER_ROLES` in `packages/shared/src/types.ts`
2. Update Prisma schema if needed
3. Add role check in API modules

### Change session status logic

1. Update `SESSION_STATUSES` in `packages/shared/src/types.ts`
2. Update session service logic
3. Update mobile UI status badge

### Add a venue

Only via database seed or admin panel (TODO)

## File Organization

```
apps/api/src/
├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── [module]/
│   │   ├── dto/
│   │   ├── [module].service.ts
│   │   ├── [module].controller.ts
│   │   └── [module].module.ts
├── common/
│   ├── prisma.service.ts
│   ├── exception.filter.ts
│   └── types.ts
└── main.ts

apps/mobile/src/
├── screens/
│   ├── LoginScreen.tsx
│   ├── [Screen].tsx
│   └── index.ts
├── components/
│   ├── [Component].tsx
│   └── index.ts
├── hooks/
│   ├── use[Feature].ts
│   └── index.ts
├── store/
│   ├── [store].store.ts
│   └── index.ts
├── utils/
│   ├── api.ts (API client)
│   └── api-client.ts (Axios config)
└── App.tsx
```

## Useful Commands

```bash
# Workspace commands
pnpm -r build        # Build all packages
pnpm -r lint         # Lint all packages
pnpm -r type-check   # Type check all packages

# Filter commands
pnpm --filter @sport-match/api dev     # Run only API
pnpm --filter @sport-match/mobile dev  # Run only mobile

# Clean
pnpm clean           # Clean all build artifacts
```

## Resources

- NestJS: https://docs.nestjs.com
- Prisma: https://www.prisma.io/docs
- React Native: https://reactnative.dev
- TanStack Query: https://tanstack.com/query
- Zustand: https://github.com/pmndrs/zustand

## Notes for Future Developer

- The codebase follows clean architecture principles
- Focus on readability over cleverness
- Keep components small and focused
- Use TypeScript strict mode religiously
- Document complex business logic
- Test before deployment
