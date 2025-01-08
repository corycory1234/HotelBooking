ALTER TABLE "room_images" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "room_images" CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "price" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "images" jsonb;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "distance" text;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "rating" numeric(3, 1);--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "facilities" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "intro" jsonb;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "reviews" jsonb;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "room_type" jsonb;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "room_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "images" jsonb;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "availability" numeric;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "smoke" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "amenity" jsonb;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "roomsize" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "max_occupancy" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "longitude";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "amenities";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "capacity";