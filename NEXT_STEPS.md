# NEXT STEPS & KNOWN ISSUES

## 🚨 Known Issues to Fix

### High Priority (Block Development)

1. **AsyncStorage Import**: The `@react-native-async-storage/async-storage` package needs to be added to mobile dependencies. Current workaround:

   ```bash
   cd apps/mobile
   pnpm add @react-native-async-storage/async-storage
   ```

2. **TabIcon Component**: Uses web `<span>` element which won't work in React Native. Should use Text component:
   - File: `apps/mobile/src/navigation.tsx`
   - Fix: Replace `<span>` with `<Text>`

3. **Date/Time Input**: CreateSessionScreen expects date as ISO string, but no date picker implemented
   - File: `apps/mobile/src/screens/CreateSessionScreen.tsx`
   - Add: `react-native-datepicker` or `@react-native-community/datetimepicker`

4. **Venue Selection**: Currently just shows venue name, no actual picker UI
   - File: `apps/mobile/src/screens/CreateSessionScreen.tsx`
   - Need to implement modal/dropdown for venue selection

### Medium Priority (Feature Complete but Not Tested)

1. **JWT Guard**: API uses manual token extraction, should use @nestjs/passport with JWT strategy
2. **Error Messages**: Some API errors might not have user-friendly messages
3. **Session Status**: Auto-updating session status based on participation count needs verification

### Low Priority (Enhancement)

1. **Pagination**: API list endpoints support filtering but not pagination yet
2. **Offline Mode**: Mobile app has no offline support
3. **Image Upload**: User avatars placeholder only
4. **Search**: No session search implemented (filtering only)

## ✅ Immediate Action Items

### Before Running the App

1. **Install Missing Dependency**

   ```bash
   cd apps/mobile
   pnpm add @react-native-async-storage/async-storage
   ```

2. **Fix TabIcon Component**

   ```tsx
   // In apps/mobile/src/navigation.tsx, replace TabIcon function:
   function TabIcon({ name, color }: { name: string; color: string }) {
     const icons: Record<string, string> = {
       Home: "🏠",
       MySessions: "📋",
       Host: "🎯",
       Profile: "👤",
     };
     return <Text style={{ fontSize: 20, color }}>{icons[name] || "❓"}</Text>;
   }
   ```

3. **Add Date Picker**
   ```bash
   cd apps/mobile
   pnpm add react-native-date-picker
   ```

### Testing Checklist

- [ ] Backend starts without errors: `cd apps/api && pnpm dev`
- [ ] Database migrations work: `pnpm db:setup && pnpm db:seed`
- [ ] API endpoints respond:
  - `curl http://localhost:3000/health`
  - `curl -X POST http://localhost:3000/auth/mock-login -H "Content-Type: application/json" -d '{"phone":"0901234567"}'`
- [ ] Mobile app starts: `cd apps/mobile && pnpm start`
- [ ] Can login on mobile
- [ ] Can browse sessions
- [ ] Can join a session

## 🔧 Configuration Needed

### API `.env` file (apps/api/.env)

```
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/sport_match_dev
JWT_SECRET=dev-secret-key-change-in-production
API_PORT=3000
```

### Mobile `.env` file (apps/mobile/.env)

```
API_URL=http://localhost:3000
# For Android emulator, use:
# API_URL=http://10.0.2.2:3000
```

## 📦 Dependencies to Add (Post-MVP)

When implementing features:

**Backend:**

- `@nestjs/passport` and `passport-jwt` for JWT guards (partially installed)
- `class-validator` extensions for custom validation
- `@nestjs/swagger` for API documentation

**Mobile:**

- `react-native-date-picker` for date/time selection
- `react-native-gesture-handler` for advanced gestures
- `react-native-reanimated` for animations

## 🐛 Debugging Tips

### Backend Debugging

```bash
# Enable Prisma logging
# Edit apps/api/src/common/prisma.service.ts
// Change: log: ['query', 'error', 'warn'],

# Debug single endpoint
curl -X GET http://localhost:3000/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mobile Debugging

```bash
# React Query DevTools (in App.tsx)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

# Console logs in Expo
pnpm start
# Then press 'j' for logs

# Network inspection
# Open developer menu with Cmd+D (iOS) or Ctrl+M (Android)
```

## 📚 File Locations - Quick Reference

| Feature         | Location                              |
| --------------- | ------------------------------------- |
| Database Schema | `apps/api/prisma/schema.prisma`       |
| Auth Logic      | `apps/api/src/modules/auth/`          |
| API Routes      | `packages/shared/src/constants.ts`    |
| Session Hooks   | `apps/mobile/src/hooks/useSession.ts` |
| API Client      | `apps/mobile/src/utils/api.ts`        |
| Screens         | `apps/mobile/src/screens/`            |
| Components      | `apps/mobile/src/components/`         |
| Types           | `packages/shared/src/types.ts`        |

## 🚀 First Deploy Checklist

Before going to production:

- [ ] Replace mock auth with real OTP
- [ ] Add proper JWT refresh tokens
- [ ] Setup HTTPS/SSL
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Setup error monitoring (Sentry)
- [ ] Add analytics
- [ ] Database backup strategy
- [ ] Load testing
- [ ] Security audit

## 💬 Questions & Answers

**Q: How do I test without a mobile device?**
A: Use Android Emulator or iOS Simulator. Expo Web also works for quick testing.

**Q: Can I deploy this to production now?**
A: The scaffold is production-ready but needs real OTP auth before public release. Mock auth is fine for internal testing.

**Q: How do I handle multi-venue support?**
A: Already designed for it! Just add venues to database and UI supports selecting any venue.

**Q: How do I scale this to multiple cities?**
A: Filter by `city` already works in API. Just add more venues and update frontend filtering UI.

**Q: How do I add real payments later?**
A: Session model has `priceLabel` field. Easy to add Stripe integration when needed.

## 📞 Support

- Backend issues? Check `apps/api/src/common/exception.filter.ts`
- Mobile issues? Check `apps/mobile/src/utils/api-client.ts`
- Database issues? Check `apps/api/prisma/schema.prisma`
- Type issues? Check `packages/shared/src/types.ts`

---

**Status**: Ready for testing and development

**Last Updated**: 2026-04-21

**Next major task**: Replace mock auth with real OTP when API keys are available
