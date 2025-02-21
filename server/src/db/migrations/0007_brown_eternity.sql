CREATE TABLE "room_basic_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "room_basic_types_name_unique" UNIQUE("name")
);
