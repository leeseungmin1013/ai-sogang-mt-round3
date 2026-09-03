export type GameStatus =
  | 'LOBBY'
  | 'QUESTION_OPEN'
  | 'SUBMISSION_LOCKED'
  | 'AI_GENERATING'
  | 'ANSWER_READY'
  | 'ANSWER_REVEALED'
  | 'LEADERBOARD'
  | 'FINISHED';

export type GameOption = { key: string; text: string };
export type GameQuestion = {
  order: number;
  prompt: string;
  options: GameOption[];
  fallback: { choice: string; reason: string };
};

export type LeaderboardEntry = {
  participantId: string;
  nickname: string;
  score: number;
  correctCount: number;
  rank: number;
};

export type RoundResult = {
  participantId: string;
  nickname: string;
  choice: string;
  reason: string;
  choiceScore: number;
  semanticScore: number;
  totalScore: number;
  similarity: number;
  rank: number;
};

export type PublicGameState = {
  roomCode: string;
  title: string;
  status: GameStatus;
  stateVersion: number;
  currentQuestion: GameQuestion | null;
  closesAt: string | null;
  participantCount: number;
  submissionCount: number;
  answer: null | {
    choice: string;
    choiceText: string;
    reason: string;
    displayAnswer: string;
    source: 'live' | 'fallback';
  };
  roundResults: RoundResult[];
  leaderboard: LeaderboardEntry[];
  me?: { participantId: string; nickname: string } | null;
  mySubmission?: { choice: string; reason: string } | null;
  myResult?: RoundResult | null;
  serverTime: string;
};
