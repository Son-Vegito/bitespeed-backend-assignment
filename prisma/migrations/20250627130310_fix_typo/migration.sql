/*
  Warnings:

  - You are about to drop the column `linkedPrecedence` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "linkedPrecedence",
ADD COLUMN     "linkPrecedence" "Precedence" NOT NULL DEFAULT 'primary';
