CREATE TABLE "GameSession" (
	"id" text PRIMARY KEY NOT NULL,
	"hostId" text NOT NULL,
	"venueId" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" text NOT NULL,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"skillLevel" text NOT NULL,
	"maxPlayers" integer DEFAULT 16 NOT NULL,
	"priceLabel" text,
	"status" text DEFAULT 'open' NOT NULL,
	"sportType" text DEFAULT 'badminton' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "HostProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"displayName" text NOT NULL,
	"bio" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "HostProfile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "SessionParticipant" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text NOT NULL,
	"attendanceStatus" text DEFAULT 'joined' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text,
	"name" text NOT NULL,
	"avatarUrl" text,
	"role" text DEFAULT 'player' NOT NULL,
	"city" text,
	"district" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "Venue" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"address" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_hostId_User_id_fk" FOREIGN KEY ("hostId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_venueId_Venue_id_fk" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HostProfile" ADD CONSTRAINT "HostProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SessionParticipant" ADD CONSTRAINT "SessionParticipant_sessionId_GameSession_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."GameSession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SessionParticipant" ADD CONSTRAINT "SessionParticipant_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "GameSession_hostId_idx" ON "GameSession" USING btree ("hostId");--> statement-breakpoint
CREATE INDEX "GameSession_venueId_idx" ON "GameSession" USING btree ("venueId");--> statement-breakpoint
CREATE INDEX "GameSession_date_idx" ON "GameSession" USING btree ("date");--> statement-breakpoint
CREATE INDEX "GameSession_status_idx" ON "GameSession" USING btree ("status");--> statement-breakpoint
CREATE INDEX "GameSession_skillLevel_idx" ON "GameSession" USING btree ("skillLevel");--> statement-breakpoint
CREATE INDEX "HostProfile_isActive_idx" ON "HostProfile" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "SessionParticipant_sessionId_idx" ON "SessionParticipant" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "SessionParticipant_userId_idx" ON "SessionParticipant" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "SessionParticipant_sessionId_userId_key" ON "SessionParticipant" USING btree ("sessionId","userId");--> statement-breakpoint
CREATE INDEX "User_phone_idx" ON "User" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "User_role_idx" ON "User" USING btree ("role");--> statement-breakpoint
CREATE INDEX "Venue_city_idx" ON "Venue" USING btree ("city");--> statement-breakpoint
CREATE INDEX "Venue_district_idx" ON "Venue" USING btree ("district");--> statement-breakpoint
CREATE INDEX "Venue_city_district_idx" ON "Venue" USING btree ("city","district");