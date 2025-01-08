CREATE TYPE "public"."user_type" AS ENUM('traveler', 'hotel_owner');--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_type" "user_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hotel_name" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phone";