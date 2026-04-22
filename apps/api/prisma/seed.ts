import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  await prisma.sessionParticipant.deleteMany({});
  await prisma.gameSession.deleteMany({});
  await prisma.hostProfile.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.user.deleteMany({});

  // Create test users
  const player1 = await prisma.user.create({
    data: {
      phone: '0901234567',
      name: 'Nguyen Van A',
      role: 'player',
      city: 'Nha Trang',
      district: 'Nha Trang',
    },
  });

  const player2 = await prisma.user.create({
    data: {
      phone: '0902345678',
      name: 'Tran Thi B',
      role: 'player',
      city: 'Nha Trang',
      district: 'Nha Trang',
    },
  });

  const hostUser = await prisma.user.create({
    data: {
      phone: '0903456789',
      name: 'Pham Van Host',
      role: 'host',
      city: 'Nha Trang',
      district: 'Nha Trang',
    },
  });

  // Create host profile
  await prisma.hostProfile.create({
    data: {
      userId: hostUser.id,
      displayName: 'Pham\'s Badminton Arena',
      bio: 'Passionate badminton enthusiast organizing weekly sessions',
      isActive: true,
    },
  });

  // Create venues
  const venue1 = await prisma.venue.create({
    data: {
      name: 'Nha Trang Sports Center',
      city: 'Nha Trang',
      district: 'Nha Trang',
      address: '123 Tran Phu St, Nha Trang',
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Gym 24h',
      city: 'Nha Trang',
      district: 'Nha Trang',
      address: '456 Hung Vuong St, Nha Trang',
    },
  });

  // Create sessions
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const session1 = await prisma.gameSession.create({
    data: {
      hostId: hostUser.id,
      venueId: venue1.id,
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
    },
  });

  const session2 = await prisma.gameSession.create({
    data: {
      hostId: hostUser.id,
      venueId: venue2.id,
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
    },
  });

  // Add participants
  await prisma.sessionParticipant.create({
    data: {
      sessionId: session1.id,
      userId: player1.id,
      attendanceStatus: 'joined',
    },
  });

  await prisma.sessionParticipant.create({
    data: {
      sessionId: session2.id,
      userId: player2.id,
      attendanceStatus: 'confirmed',
    },
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
    await prisma.$disconnect();
  });
