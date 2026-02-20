CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
