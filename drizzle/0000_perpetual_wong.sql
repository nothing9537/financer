CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"plaid_id" text
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"plaid_id" text
);
--> statement-breakpoint
CREATE TABLE "connected_banks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"cursor" text,
	"item_id" text NOT NULL,
	CONSTRAINT "connected_banks_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "connected_banks_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"payee" text NOT NULL,
	"notes" text,
	"date" timestamp NOT NULL,
	"account_id" text NOT NULL,
	"category_id" text
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_user_idx" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_plaid_unique" ON "categories" USING btree ("user_id","plaid_id");