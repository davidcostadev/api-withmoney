# Migration `20201119013330-init`

This migration has been generated by David Costa at 11/18/2020, 10:33:30 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."TransactionType" AS ENUM ('CreditCard', 'Deposit', 'FixedExpense', 'VariableExpense')

CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
)

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
)

CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
)

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "hasVerifiedEmail" BOOLEAN NOT NULL DEFAULT false,
    "hashToVerifyEmail" TEXT,
    "hashToChangePassword" TEXT,
    "birthDay" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "User.hashToVerifyEmail_unique" ON "User"("hashToVerifyEmail")

CREATE UNIQUE INDEX "User.hashToChangePassword_unique" ON "User"("hashToChangePassword")

ALTER TABLE "Account" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Category" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Transaction" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Transaction" ADD FOREIGN KEY("categoryId")REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Transaction" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201119013330-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,76 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Account {
+  id           String        @id @default(uuid())
+  name         String
+  userId       String
+  createdAt    DateTime      @default(now())
+  updatedAt    DateTime      @default(now())
+  deletedAt    DateTime?
+  user         User          @relation(fields: [userId], references: [id])
+  transactions Transaction[]
+}
+
+model Category {
+  id           String          @id @default(uuid())
+  userId       String
+  name         String
+  type         TransactionType
+  createdAt    DateTime        @default(now())
+  updatedAt    DateTime        @default(now())
+  deletedAt    DateTime?
+  user         User            @relation(fields: [userId], references: [id])
+  transactions Transaction[]
+}
+
+model Transaction {
+  id         String          @id @default(uuid())
+  accountId  String
+  categoryId String?
+  userId     String
+  name       String
+  value      Float
+  isPaid     Boolean         @default(false)
+  type       TransactionType
+  createdAt  DateTime        @default(now())
+  updatedAt  DateTime        @default(now())
+  deletedAt  DateTime?
+  account    Account         @relation(fields: [accountId], references: [id])
+  category   Category?       @relation(fields: [categoryId], references: [id])
+  user       User            @relation(fields: [userId], references: [id])
+}
+
+model User {
+  id                   String        @id @default(cuid())
+  email                String        @unique
+  password             String
+  firstName            String
+  lastName             String
+  hasVerifiedEmail     Boolean       @default(false)
+  hashToVerifyEmail    String?       @unique
+  hashToChangePassword String?       @unique
+  birthDay             DateTime?
+  createdAt            DateTime      @default(now())
+  updatedAt            DateTime      @default(now())
+  deletedAt            DateTime?
+  accounts             Account[]
+  categories           Category[]
+  transactions         Transaction[]
+}
+
+enum TransactionType {
+  CreditCard
+  Deposit
+  FixedExpense
+  VariableExpense
+}
```

