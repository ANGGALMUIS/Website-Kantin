-- CreateTable
CREATE TABLE "QueueCounter" (
    "id" TEXT NOT NULL,
    "canteenId" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueueCounter_pkey" PRIMARY KEY ("id")
);
