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
    "reviewedByRole" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("approved", "avatarUrl", "company", "content", "createdAt", "featured", "id", "name", "rating", "role", "updatedAt") SELECT "approved", "avatarUrl", "company", "content", "createdAt", "featured", "id", "name", "rating", "role", "updatedAt" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
