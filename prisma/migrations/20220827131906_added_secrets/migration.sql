-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "GuestSecret" (
    "secret" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GuestSecret_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestSecret_userId_key" ON "GuestSecret"("userId");

-- AddForeignKey
ALTER TABLE "GuestSecret" ADD CONSTRAINT "GuestSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
