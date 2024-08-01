-- CreateTable
CREATE TABLE "parent_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parent_feedback" ADD CONSTRAINT "parent_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
