CREATE TYPE "public"."key_type" AS ENUM('primary', 'recovery');--> statement-breakpoint
ALTER TABLE "user_keys" ALTER COLUMN "key_type" SET DEFAULT 'primary'::"public"."key_type";--> statement-breakpoint
ALTER TABLE "user_keys" ALTER COLUMN "key_type" SET DATA TYPE "public"."key_type" USING "key_type"::"public"."key_type";--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "vault_items" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "vault_secrets" ADD COLUMN "payload_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE INDEX "folders_deletedAt_idx" ON "folders" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "vault_items_deletedAt_idx" ON "vault_items" USING btree ("deleted_at");