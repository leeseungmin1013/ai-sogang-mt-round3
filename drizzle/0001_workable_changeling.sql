CREATE INDEX `idx_scores_leaderboard` ON `scores` (`room_code`,`participant_id`);--> statement-breakpoint
CREATE INDEX `idx_submissions_round` ON `submissions` (`room_code`,`question_no`);