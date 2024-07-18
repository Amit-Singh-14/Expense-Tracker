DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('Food', 'Transportation', 'Housing', 'Entertainment', 'Health', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expense" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"date" date NOT NULL,
	"category" "category" DEFAULT 'Other' NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id" ON "expense" USING btree ("user_id");