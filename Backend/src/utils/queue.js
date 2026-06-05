import prisma from "../config/prisma.js";

export const generateQueueNumber = async (tx, canteenId) => {
  const today = new Date().toISOString().split("T")[0];

  const counter = await tx.queueCounter.findFirst({
    where: {
      canteenId,
      date: today,
    },
  });

  if (!counter) {
    await tx.queueCounter.create({
      data: {
        canteenId,
        date: today,
        lastNumber: 1,
      },
    });

    return "A-001";
  }

  const nextNumber = counter.lastNumber + 1;

  await tx.queueCounter.update({
    where: {
      id: counter.id,
    },
    data: {
      lastNumber: {
        increment: 1,
      },
    },
  });

  return `A-${String(nextNumber).padStart(3, "0")}`;
};
