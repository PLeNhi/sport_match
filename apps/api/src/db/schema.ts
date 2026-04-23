import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// User model - core entity
export const users = pgTable(
  "User",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    phone: text("phone").unique(),
    name: text("name").notNull(),
    avatarUrl: text("avatarUrl"),
    role: text("role").default("player").notNull(), // 'player', 'host', 'admin'
    city: text("city"),
    district: text("district"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    phoneIdx: index("User_phone_idx").on(table.phone),
    roleIdx: index("User_role_idx").on(table.role),
  }),
);

// HostProfile model - one-to-one with User
export const hostProfiles = pgTable(
  "HostProfile",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("displayName").notNull(),
    bio: text("bio"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    isActiveIdx: index("HostProfile_isActive_idx").on(table.isActive),
  }),
);

// Venue model - physical location where sessions happen
export const venues = pgTable(
  "Venue",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    address: text("address").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    cityIdx: index("Venue_city_idx").on(table.city),
    districtIdx: index("Venue_district_idx").on(table.district),
    cityDistrictIdx: index("Venue_city_district_idx").on(
      table.city,
      table.district,
    ),
  }),
);

// GameSession model - badminton session
export const gameSessions = pgTable(
  "GameSession",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    hostId: text("hostId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    venueId: text("venueId")
      .references(() => venues.id)
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    date: text("date").notNull(), // ISO date: YYYY-MM-DD
    startTime: text("startTime").notNull(), // HH:mm format
    endTime: text("endTime").notNull(), // HH:mm format
    skillLevel: text("skillLevel").notNull(), // 'beginner', 'intermediate', 'advanced'
    maxPlayers: integer("maxPlayers").default(16).notNull(),
    priceLabel: text("priceLabel"), // display only for MVP
    status: text("status").default("open").notNull(), // 'open', 'full', 'completed', 'cancelled'
    sportType: text("sportType").default("badminton").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    hostIdIdx: index("GameSession_hostId_idx").on(table.hostId),
    venueIdIdx: index("GameSession_venueId_idx").on(table.venueId),
    dateIdx: index("GameSession_date_idx").on(table.date),
    statusIdx: index("GameSession_status_idx").on(table.status),
    skillLevelIdx: index("GameSession_skillLevel_idx").on(table.skillLevel),
  }),
);

// SessionParticipant model - join relationship
export const sessionParticipants = pgTable(
  "SessionParticipant",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sessionId: text("sessionId")
      .references(() => gameSessions.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    attendanceStatus: text("attendanceStatus").default("joined").notNull(), // 'joined', 'confirmed', 'declined', 'removed'
    joinedAt: timestamp("joinedAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    sessionIdIdx: index("SessionParticipant_sessionId_idx").on(table.sessionId),
    userIdIdx: index("SessionParticipant_userId_idx").on(table.userId),
    sessionUserUnique: uniqueIndex(
      "SessionParticipant_sessionId_userId_key",
    ).on(table.sessionId, table.userId),
  }),
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  hostProfile: one(hostProfiles, {
    fields: [users.id],
    references: [hostProfiles.userId],
  }),
  hostedSessions: many(gameSessions),
  participations: many(sessionParticipants),
}));

export const hostProfilesRelations = relations(hostProfiles, ({ one }) => ({
  user: one(users, {
    fields: [hostProfiles.userId],
    references: [users.id],
  }),
}));

export const venuesRelations = relations(venues, ({ many }) => ({
  sessions: many(gameSessions),
}));

export const gameSessionsRelations = relations(
  gameSessions,
  ({ one, many }) => ({
    host: one(users, {
      fields: [gameSessions.hostId],
      references: [users.id],
    }),
    venue: one(venues, {
      fields: [gameSessions.venueId],
      references: [venues.id],
    }),
    participants: many(sessionParticipants),
  }),
);

export const sessionParticipantsRelations = relations(
  sessionParticipants,
  ({ one }) => ({
    session: one(gameSessions, {
      fields: [sessionParticipants.sessionId],
      references: [gameSessions.id],
    }),
    user: one(users, {
      fields: [sessionParticipants.userId],
      references: [users.id],
    }),
  }),
);
