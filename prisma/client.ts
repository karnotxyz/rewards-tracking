import type { PrismaClient } from "./generated/client/index.d.ts";
import Prisma from "./generated/client/index.d.ts";
export const prisma: PrismaClient = new Prisma.PrismaClient();

export * from "./generated/client/index.d.ts";
