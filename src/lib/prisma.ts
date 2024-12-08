import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

// Enable connection pooling for NeonDB
const DATABASE_URL = process.env.DATABASE_URL || "";
if (DATABASE_URL.includes("neon.tech")) {
  console.log("Using NeonDB connection pooling");
}

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
