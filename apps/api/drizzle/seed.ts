import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  await db.delete(schema.sessionParticipants);
  await db.delete(schema.gameSessions);
  await db.delete(schema.hostProfiles);
  await db.delete(schema.venues);
  await db.delete(schema.users);

  // Create test users
  const player1 = await db.insert(schema.users).values({
    phone: '0901234567',
    name: 'Nguyen Van A',
    role: 'player',
    city: 'Nha Trang',
    district: 'Nha Trang',
  }).returning();

  const player2 = await db.insert(schema.users).values({
    phone: '0902345678',
    name: 'Tran Thi B',
    role: 'player',
    city: 'Nha Trang',
    district: 'Nha Trang',
  }).returning();

  const hostUser = await db.insert(schema.users).values({
    phone: '0903456789',
    name: 'Pham Van Host',
    role: 'host',
    city: 'Nha Trang',
    district: 'Nha Trang',
  }).returning();

  // Create host profile
  await db.insert(schema.hostProfiles).values({
    userId: hostUser[0].id,
    displayName: 'Pham\'s Badminton Arena',
    bio: 'Passionate badminton enthusiast organizing weekly sessions',
    isActive: true,
  });

  // Create venues
  const venue1 = await db.insert(schema.venues).values({
    name: 'Nha Trang Sports Center',
    city: 'Nha Trang',
    district: 'Nha Trang',
    address: '123 Tran Phu St, Nha Trang',
  }).returning();

  const venue2 = await db.insert(schema.venues).values({
    name: 'Gym 24h',
    city: 'Nha Trang',
    district: 'Nha Trang',
    address: '456 Hung Vuong St, Nha Trang',
  }).returning();

  // Create sessions
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const session1 = await db.insert(schema.gameSessions).values({
    hostId: hostUser[0].id,
    venueId: venue1[0].id,
    title: 'Beginners Welcome - Monday Evening',
    description: 'Casual badminton session, all levels welcome',
    date: tomorrow,
    startTime: '18:00',
    endTime: '20:00',
    skillLevel: 'beginner',
    maxPlayers: 12,
    priceLabel: '50,000 VND',
    status: 'open',
    sportType: 'badminton',
  }).returning();

  const session2 = await db.insert(schema.gameSessions).values({
    hostId: hostUser[0].id,
    venueId: venue2[0].id,
    title: 'Intermediate Mixed Doubles',
    description: 'Competitive session, intermediate players',
    date: tomorrow,
    startTime: '19:00',
    endTime: '21:00',
    skillLevel: 'intermediate',
    maxPlayers: 10,
    priceLabel: '60,000 VND',
    status: 'open',
    sportType: 'badminton',
  }).returning();

  // Add participants
  await db.insert(schema.sessionParticipants).values({
    sessionId: session1[0].id,
    userId: player1[0].id,
    attendanceStatus: 'joined',
  });

  await db.insert(schema.sessionParticipants).values({
    sessionId: session2[0].id,
    userId: player2[0].id,
    attendanceStatus: 'confirmed',
  });

  console.log('✅ Database seeded successfully');
  console.log(`
📱 Test credentials:
  Player 1: 0901234567
  Player 2: 0902345678
  Host: 0903456789
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });