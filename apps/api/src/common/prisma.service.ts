import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: postgres.Sql;
  public db: ReturnType<typeof drizzle>;

  constructor() {
    this.client = postgres(process.env.DATABASE_URL!, { prepare: false });
    this.db = drizzle(this.client, { schema });
  }

  async onModuleInit() {
    // Test connection
    await this.client`SELECT 1`;
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
