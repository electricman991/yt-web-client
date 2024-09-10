CREATE TABLE `yt_web_client_comments` (
	`id` integer PRIMARY KEY NOT NULL,
	`video_id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	`username` text(255) NOT NULL,
	`content` text
);
--> statement-breakpoint
CREATE INDEX `comments_video_idx` ON `yt_web_client_comments` (`video_id`);