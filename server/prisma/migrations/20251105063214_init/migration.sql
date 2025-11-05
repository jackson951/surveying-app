-- CreateTable
CREATE TABLE "Survey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "dob" TEXT NOT NULL,
    "favoriteFoods" TEXT NOT NULL,
    "eatOutRating" INTEGER NOT NULL,
    "watchMoviesRating" INTEGER NOT NULL,
    "watchTVRating" INTEGER NOT NULL,
    "listenToRadioRating" INTEGER NOT NULL,
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Survey_email_key" ON "Survey"("email");
