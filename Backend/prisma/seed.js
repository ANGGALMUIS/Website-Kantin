import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: "admin@polines.ac.id",
    },
  });

  if (existingAdmin) {
    console.log("Super Admin sudah ada");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",

      email: "admin@polines.ac.id",

      password: hashedPassword,

      role: "SUPER_ADMIN",

      status: "ACTIVE",
    },
  });

  console.log("Super Admin berhasil dibuat");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
