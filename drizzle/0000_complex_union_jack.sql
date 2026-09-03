CREATE TABLE `ai_answers` (
	`room_code` text NOT NULL,
	`question_no` integer NOT NULL,
	`choice` text NOT NULL,
	`reason` text NOT NULL,
	`display_answer` text NOT NULL,
	`source` text NOT NULL,
	`model` text NOT NULL,
	`response_id` text,
	`latency_ms` integer NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`room_code`, `question_no`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`room_code` text NOT NULL,
	`nickname` text NOT NULL,
	`normalized_nickname` text NOT NULL,
	`token_hash` text NOT NULL,
	`joined_at` text NOT NULL,
	`last_seen_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_participants_room_nickname` ON `participants` (`room_code`,`normalized_nickname`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_participants_token` ON `participants` (`token_hash`);--> statement-breakpoint
CREATE TABLE `questions` (
	`room_code` text NOT NULL,
	`order_no` integer NOT NULL,
	`prompt` text NOT NULL,
	`options_json` text NOT NULL,
	`fallback_json` text NOT NULL,
	PRIMARY KEY(`room_code`, `order_no`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'LOBBY' NOT NULL,
	`current_question` integer DEFAULT 0 NOT NULL,
	`closes_at` text,
	`state_version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scores` (
	`room_code` text NOT NULL,
	`question_no` integer NOT NULL,
	`participant_id` text NOT NULL,
	`choice_score` integer NOT NULL,
	`similarity` real NOT NULL,
	`semantic_score` integer NOT NULL,
	`total_score` integer NOT NULL,
	PRIMARY KEY(`room_code`, `question_no`, `participant_id`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`room_code` text NOT NULL,
	`question_no` integer NOT NULL,
	`participant_id` text NOT NULL,
	`choice` text NOT NULL,
	`reason` text NOT NULL,
	`submitted_at` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`room_code`, `question_no`, `participant_id`)
);
