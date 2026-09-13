import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

vi.mock("@/db/database", () => {
  const testDb = new Database(":memory:");

  testDb.pragma("foreign_keys = ON");

  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  testDb.exec(schema);

  return {
    db: testDb,
  };
});

import {
  getPatientById,
  getPatients,
  createPatient,
} from "@/data/patient-repository";

const firstPatient = {
  id: "p1",
  firstName: "Ahmed nohsin",
  lastName: "Benali",
  phone: "0550123456",
  createdAt: "2026-09-01",
};

const secondPatient = {
  id: "p2",
  firstName: "Sara",
  lastName: "Test",
  phone: "0550000000",
  createdAt: "2026-09-02",
};

describe("patient repository", () => {
  beforeEach(() => {
    createPatient(firstPatient);
    createPatient(secondPatient);
  });

  it("should return the first patient", () => {
    const patient = getPatientById("p1");

    expect(patient?.firstName).toBe("Ahmed nohsin");
  });

  it("should return undefined for a non-existing patient", () => {
    const patient = getPatientById("unknown");

    expect(patient).toBeUndefined();
  });

  it("should return all patients", () => {
    const patients = getPatients();

    expect(patients).toHaveLength(2);
  });

  it("should create a new patient", () => {
    const patient = {
      id: "test-patient",
      firstName: "Test",
      lastName: "Patient",
      phone: "0550000000",
      createdAt: "2026-09-13",
    };

    createPatient(patient);

    const savedPatient = getPatientById("test-patient");

    expect(savedPatient?.firstName).toBe("Test");
  });
});