CREATE TABLE `file` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`parentId` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`viewedAt` integer NOT NULL,
	FOREIGN KEY (`parentId`) REFERENCES `folder`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `folder` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`parentId` integer,
	FOREIGN KEY (`parentId`) REFERENCES `folder`(`id`) ON UPDATE no action ON DELETE cascade
);
