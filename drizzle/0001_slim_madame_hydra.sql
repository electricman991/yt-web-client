CREATE TABLE `yt_web_client_videos` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`uid` text(255) NOT NULL,
	`filename` text(255) NOT NULL,
	`status` text(255) NOT NULL,
	`title` text(255),
	`description` text
);
--> statement-breakpoint
CREATE INDEX `videos_uid_idx` ON `yt_web_client_videos` (`uid`);