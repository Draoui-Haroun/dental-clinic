
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "db", "database.db");
export const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
const schemaPath = path.join(process.cwd(), "db", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

db.exec(schema);