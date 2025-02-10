ALTER TABLE "room_types" ALTER COLUMN "room_size" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "hotel_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "hotel_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "hotel_image_list" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "total_rating" numeric(3, 1) NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "facility_list" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "hotel_intro" text;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "review_list" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "is_open" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "is_collected" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "offer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "room_type_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "room_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "room_type_image_list" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "room_availability" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "amenity_list" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "max_people" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "view" varchar(255);--> statement-breakpoint
ALTER TABLE "room_types" ADD COLUMN "bed_type" varchar(255);--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "facilities";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "intro";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "reviews";--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "room_types" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "room_types" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "room_types" DROP COLUMN "availability";--> statement-breakpoint
ALTER TABLE "room_types" DROP COLUMN "amenity";--> statement-breakpoint
ALTER TABLE "room_types" DROP COLUMN "max_occupancy";