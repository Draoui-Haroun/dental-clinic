
import { cpSync, existsSync } from "fs";
import path from "path";

const root = process.cwd();

const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(root, ".next", "standalone", ".next", "static");

const publicSrc = path.join(root, "public");
const publicDest = path.join(root, ".next", "standalone", "public");

if (existsSync(staticSrc)) {
  cpSync(staticSrc, staticDest, { recursive: true });
  console.log("Copied .next/static ->", staticDest);
}

if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true });
  console.log("Copied public ->", publicDest);
}