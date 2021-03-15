-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role"[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.userId_unique" ON "Account"("userId");
