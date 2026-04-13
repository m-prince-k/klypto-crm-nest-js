-- Add module-based dashboard access storage to roles
ALTER TABLE "Role"
ADD COLUMN IF NOT EXISTS "dashboardModules" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Track assignment updates on user-role relations
ALTER TABLE "UserRole"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "UserRole"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "updatedAt" IS NULL;

ALTER TABLE "UserRole"
ALTER COLUMN "updatedAt" SET NOT NULL;