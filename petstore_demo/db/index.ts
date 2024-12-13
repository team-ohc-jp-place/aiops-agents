import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema";

// 必要な環境変数を取得
const dbUser = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbHost = process.env.PGHOST;
const dbPort = process.env.PGPORT;
const dbName = process.env.PGDATABASE;

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("PGUSER:", dbUser);
console.log("PGPASSWORD:", dbPassword);
console.log("PGPORT:", dbPort);
console.log("PGDATABASE:", dbName);

// DATABASE_URL を動的に生成
if (!dbUser || !dbPassword || !dbHost || !dbPort || !dbName) {
  throw new Error("Missing required database environment variables");
}

const databaseUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
process.env.DATABASE_URL = databaseUrl; // 環境変数に設定

console.log("Generated DATABASE_URL:", databaseUrl);

// データベース接続
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // 必要に応じて SSL を有効に設定
});

export const db = drizzle(pool, { schema });
