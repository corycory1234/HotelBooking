CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hotel_id" uuid NOT NULL,
	"room_id" uuid NOT NULL,
	"booking_image" varchar(255),
	"traveler_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(20),
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"checkin_time" varchar(10) NOT NULL,
	"checkout_time" varchar(10) NOT NULL,
	"adults" integer NOT NULL,
	"children" integer DEFAULT 0,
	"room_count" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"tax" numeric(4, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"review" text,
	"star_rating" integer,
	"address" text,
	"city" varchar(100),
	"country" varchar(100),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"facilities" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_room_types_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;