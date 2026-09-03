import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const rooms = sqliteTable('rooms', {
  code: text('code').primaryKey(),
  title: text('title').notNull(),
  status: text('status').notNull().default('LOBBY'),
  currentQuestion: integer('current_question').notNull().default(0),
  closesAt: text('closes_at'),
  stateVersion: integer('state_version').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const questions = sqliteTable(
  'questions',
  {
    roomCode: text('room_code').notNull(),
    orderNo: integer('order_no').notNull(),
    prompt: text('prompt').notNull(),
    optionsJson: text('options_json').notNull(),
    fallbackJson: text('fallback_json').notNull(),
  },
  (table) => [primaryKey({ columns: [table.roomCode, table.orderNo] })],
);

export const participants = sqliteTable(
  'participants',
  {
    id: text('id').primaryKey(),
    roomCode: text('room_code').notNull(),
    nickname: text('nickname').notNull(),
    normalizedNickname: text('normalized_nickname').notNull(),
    tokenHash: text('token_hash').notNull(),
    joinedAt: text('joined_at').notNull(),
    lastSeenAt: text('last_seen_at').notNull(),
  },
  (table) => [
    uniqueIndex('idx_participants_room_nickname').on(
      table.roomCode,
      table.normalizedNickname,
    ),
    uniqueIndex('idx_participants_token').on(table.tokenHash),
  ],
);

export const submissions = sqliteTable(
  'submissions',
  {
    roomCode: text('room_code').notNull(),
    questionNo: integer('question_no').notNull(),
    participantId: text('participant_id').notNull(),
    choice: text('choice').notNull(),
    reason: text('reason').notNull(),
    submittedAt: text('submitted_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.roomCode, table.questionNo, table.participantId],
    }),
    index('idx_submissions_round').on(table.roomCode, table.questionNo),
  ],
);

export const aiAnswers = sqliteTable(
  'ai_answers',
  {
    roomCode: text('room_code').notNull(),
    questionNo: integer('question_no').notNull(),
    choice: text('choice').notNull(),
    reason: text('reason').notNull(),
    displayAnswer: text('display_answer').notNull(),
    source: text('source').notNull(),
    model: text('model').notNull(),
    responseId: text('response_id'),
    latencyMs: integer('latency_ms').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.roomCode, table.questionNo] })],
);

export const scores = sqliteTable(
  'scores',
  {
    roomCode: text('room_code').notNull(),
    questionNo: integer('question_no').notNull(),
    participantId: text('participant_id').notNull(),
    choiceScore: integer('choice_score').notNull(),
    similarity: real('similarity').notNull(),
    semanticScore: integer('semantic_score').notNull(),
    totalScore: integer('total_score').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.roomCode, table.questionNo, table.participantId],
    }),
    index('idx_scores_leaderboard').on(table.roomCode, table.participantId),
  ],
);
