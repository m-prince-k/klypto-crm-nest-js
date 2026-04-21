/*
  Warnings:

  - Added the required column `ctcMax` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ctcMin` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `JobPosting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "ctcMax" INTEGER NOT NULL,
ADD COLUMN     "ctcMin" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "jobType" TEXT NOT NULL DEFAULT 'Full-time',
ADD COLUMN     "location" TEXT NOT NULL;
