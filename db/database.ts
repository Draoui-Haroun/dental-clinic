
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath =
    process.env.DENTAL_CLINIC_DB_PATH ??
    path.join(process.cwd(), "db", "database.db");

console.log("SQLITE DATABASE PATH:", dbPath);

const dbDirectory = path.dirname(dbPath);

if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
}

export const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

const schemaPath =
    process.env.DENTAL_CLINIC_SCHEMA_PATH ??
    path.join(process.cwd(), "db", "schema.sql");

console.log("SCHEMA PATH USED:", schemaPath);

const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);