-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "industry" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatarUrl" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "youtubeVideoId" TEXT,
    "cloudinaryPublicId" TEXT,
    "category" TEXT NOT NULL DEFAULT 'CLIENTE',
    "tags" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdByRole" TEXT NOT NULL DEFAULT 'EDITOR',
    "authorUserId" TEXT,
    "authorUsername" TEXT,
    "reviewedByRole" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testimonial_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Testimonial" ("approved", "avatarUrl", "category", "cloudinaryPublicId", "company", "content", "createdAt", "createdByRole", "featured", "id", "imageUrl", "industry", "name", "rating", "reviewedByRole", "role", "tags", "updatedAt", "videoUrl", "youtubeVideoId") SELECT "approved", "avatarUrl", "category", "cloudinaryPublicId", "company", "content", "createdAt", "createdByRole", "featured", "id", "imageUrl", "industry", "name", "rating", "reviewedByRole", "role", "tags", "updatedAt", "videoUrl", "youtubeVideoId" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
CREATE INDEX "Testimonial_authorUserId_idx" ON "Testimonial"("authorUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
