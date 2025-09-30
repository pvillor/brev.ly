ALTER TABLE "links" RENAME COLUMN "short_url" TO "short_url_suffix";--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_short_url_unique";--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_short_url_suffix_unique" UNIQUE("short_url_suffix");