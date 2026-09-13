
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

export function createTestDatabase() {
  const testDb = new Database(":memory:");

  testDb.pragma("foreign_keys = ON");

  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  testDb.exec(schema);

  return testDb;
}