'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Crown, Send, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBanner, GameHeader, LoadingGame } from '@/components/game-header';
import { gamePost, useGame } from '@/hooks/use-game';

function useCountdown(closesAt: string | null | undefined) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const update = () =>
      setRemaining(
        closesAt
          ? Math.max(0, Math.ceil((Date.parse(closesAt) - Date.now()) / 1000))
          : 0,
      );
    const immediate = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 250);
    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(timer);
    };
  }, [closesAt]);
  return remaining;
}

export function PlayerApp({ code }: { code: string }) {
  const { state, error: stateError, loading, refresh } = useGame(code, true);
  const [nickname, setNickname] = useState('');
  const [choice, setChoice] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const remaining = useCountdown(state?.closesAt);

  useEffect(() => {
    if (state?.mySubmission) {
      setChoice(state.mySubmission.choice);
      setReason(state.mySubmission.reason);
    } else if (state?.status === 'QUESTION_OPEN') {
      setChoice('');
      setReason('');
    }
  }, [state?.currentQuestion?.order, state?.mySubmission, state?.status]);

  const canSubmit = useMemo(
    () =>
      choice &&
      reason.trim().length >= 5 &&
      reason.trim().length <= 120 &&
      (!state?.closesAt || remaining > 0),
    [choice, reason, remaining, state?.closesAt],
  );

  async function join() {
    setBusy(true);
    setMessage('');
    try {
      const joined = await gamePost<{ token: string }>(code, {
        action: 'join',
        nickname: nickname.trim(),
      });
      window.localStorage.setItem(`game-token:${code}`, joined.token);
      await refresh();
    } catch (caught) {
      setMessage(
        caught instanceof Error ? caught.message : '입장하지 못했습니다.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    const token = window.localStorage.getItem(`game-token:${code}`);
    if (!token) {
      setMessage('다시 입장해 주세요.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      await gamePost(
        code,
        { action: 'submit', choice, reason: reason.trim() },
        { 'x-participant-token': token },
      );
      setMessage('답변이 저장되었습니다. 마감 전까지 수정할 수 있어요.');
      await refresh();
    } catch (caught) {
      setMessage(
        caught instanceof Error
          ? caught.message
          : '답변을 저장하지 못했습니다.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading || !state)
    return (
      <main className="min-h-screen">
        <GameHeader code={code} label="PLAYER" />
        <LoadingGame />
      </main>
    );

  if (!state.me) {
    return (
      <main className="min-h-screen overflow-hidden">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <GameHeader code={code} label="PLAYER" />
        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-84px)] max-w-md items-center px-5 pb-20">
          <div className="w-full rounded-[32px] border border-white/10 bg-white/[.055] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="text-sm font-black text-primary">ROUND 03</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-.04em]">
              게임에 입장하기
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              전광판에 표시될 닉네임을 입력해 주세요. 개인정보는 입력하지
              마세요.
            </p>
            <ErrorBanner message={message || stateError} />
            <label className="mt-7 block text-sm font-bold" htmlFor="nickname">
              닉네임
            </label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void join();
              }}
              maxLength={16}
              placeholder="예: AI새내기"
              className="mt-2 h-13 rounded-2xl bg-white/5 px-4 text-base"
            />
            <Button
              onClick={() => void join()}
              disabled={busy || nickname.trim().length < 2}
              className="mt-4 h-13 w-full rounded-2xl text-base font-black"
            >
              {busy ? '입장하는 중...' : '참가하기'}
            </Button>
            <p className="mt-4 text-center text-xs text-white/35">
              이메일이나 회원가입 없이 참여합니다.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const question = state.currentQuestion;
  const waiting = ['LOBBY'].includes(state.status);
  const generating = [
    'SUBMISSION_LOCKED',
    'AI_GENERATING',
    'ANSWER_READY',
  ].includes(state.status);
  const revealed =
    ['ANSWER_REVEALED', 'LEADERBOARD', 'FINISHED'].includes(state.status) &&
    state.answer;

  return (
    <main className="min-h-screen pb-12">
      <GameHeader code={code} label={state.me.nickname} />
      <div className="mx-auto w-full max-w-xl px-5 pt-4">
        <ErrorBanner
          message={stateError || (message.startsWith('답변이') ? '' : message)}
        />

        {waiting && <WaitingCard participantCount={state.participantCount} />}

        {state.status === 'QUESTION_OPEN' && question && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                QUESTION {question.order} / 10
              </span>
              {state.closesAt ? (
                <span
                  className={`flex items-center gap-1.5 font-black tabular-nums ${remaining <= 5 ? 'text-red-300' : 'text-[#d9ff52]'}`}
                >
                  <Clock3 className="size-4" /> {remaining}초
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-black text-cyan-300">
                  <Clock3 className="size-4" /> 사회자 마감까지
                </span>
              )}
            </div>
            <h1 className="text-balance text-2xl font-black leading-tight tracking-[-.035em] sm:text-3xl">
              {question.prompt}
            </h1>
            <div className="mt-6 grid gap-3">
              {question.options.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setChoice(option.key)}
                  className={`answer-option ${choice === option.key ? 'selected' : ''}`}
                  aria-pressed={choice === option.key}
                >
                  <span className="option-key">{option.key}</span>
                  <span>{option.text}</span>
                  {choice === option.key && (
                    <Check className="ml-auto size-5" />
                  )}
                </button>
              ))}
            </div>
            <label className="mt-6 block text-sm font-bold" htmlFor="reason">
              AI가 이렇게 고를 것 같은 이유
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={120}
              placeholder="AI의 사고방식을 예측해 한 문장으로 적어보세요."
              className="mt-2 min-h-28 rounded-2xl bg-white/5 p-4 text-base leading-6"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>최소 5자</span>
              <span>{reason.length} / 120</span>
            </div>
            <Button
              onClick={() => void submit()}
              disabled={!canSubmit || busy}
              className="mt-5 h-13 w-full rounded-2xl text-base font-black"
            >
              <Send className="size-4" />{' '}
              {busy
                ? '저장하는 중...'
                : state.mySubmission
                  ? '답변 수정하기'
                  : '답변 제출하기'}
            </Button>
            {(message || state.mySubmission) && (
              <p className="mt-3 text-center text-sm text-[#d9ff52]">
                {message ||
                  '답변이 저장되었습니다. 마감 전까지 수정할 수 있어요.'}
              </p>
            )}
          </section>
        )}

        {generating && (
          <GeneratingCard
            submitted={Boolean(state.mySubmission)}
            submissionCount={state.submissionCount}
          />
        )}

        {revealed && question && (
          <section>
            <div className="rounded-[28px] border border-primary/25 bg-primary/10 p-5 sm:p-7">
              <div className="flex items-center gap-2 text-sm font-black text-primary">
                <Sparkles className="size-4" /> OPENAI의 선택
              </div>
              <div className="mt-4 flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-black text-primary-foreground">
                  {state.answer?.choice}
                </span>
                <div>
                  <h1 className="text-xl font-black">
                    {state.answer?.choiceText}
                  </h1>
                  <p className="mt-2 leading-7 text-white/70">
                    {state.answer?.reason}
                  </p>
                </div>
              </div>
            </div>
            {state.myResult ? (
              <div className="mt-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/40">내 점수</p>
                    <p className="mt-1 text-3xl font-black">
                      {state.myResult.totalScore}
                      <span className="text-base text-white/40">점</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#d9ff52]">
                      #{state.myResult.rank}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      선택 {state.myResult.choiceScore} + 이유{' '}
                      {state.myResult.semanticScore}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-center text-sm text-muted-foreground">
                이번 문제에 제출한 답변이 없습니다.
              </p>
            )}
            {['LEADERBOARD', 'FINISHED'].includes(state.status) && (
              <Leaderboard
                entries={state.leaderboard.slice(0, 10)}
                me={state.me.participantId}
              />
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function WaitingCard({ participantCount }: { participantCount: number }) {
  return (
    <div className="mt-12 rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#d9ff52]/10 text-[#d9ff52]">
        <Sparkles className="size-7" />
      </div>
      <h1 className="mt-5 text-2xl font-black">입장 완료!</h1>
      <p className="mt-2 text-muted-foreground">
        사회자가 곧 첫 질문을 공개합니다.
      </p>
      <p className="mt-6 text-sm font-bold text-white/50">
        현재 {participantCount}명 참가 중
      </p>
    </div>
  );
}

function GeneratingCard({
  submitted,
  submissionCount,
}: {
  submitted: boolean;
  submissionCount: number;
}) {
  return (
    <div className="mt-12 rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-violet-400/10 text-violet-300">
        <Sparkles className="size-7 animate-pulse" />
      </div>
      <h1 className="mt-5 text-2xl font-black">
        {submitted ? '답변 제출 완료' : '답변 마감'}
      </h1>
      <p className="mt-2 text-muted-foreground">
        OpenAI에게 같은 질문을 묻고 있어요.
      </p>
      <p className="mt-6 text-sm font-bold text-white/50">
        총 {submissionCount}개 답변
      </p>
    </div>
  );
}

function Leaderboard({
  entries,
  me,
}: {
  entries: Array<{
    participantId: string;
    nickname: string;
    score: number;
    rank: number;
  }>;
  me: string;
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="size-4 text-[#d9ff52]" />
        <h2 className="font-black">누적 리더보드</h2>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10">
        {entries.map((entry) => (
          <div
            key={entry.participantId}
            className={`flex items-center gap-3 border-b border-white/8 px-4 py-3 last:border-b-0 ${entry.participantId === me ? 'bg-primary/10' : 'bg-white/[.035]'}`}
          >
            <span className="w-7 text-center font-black text-white/45">
              {entry.rank === 1 ? (
                <Crown className="mx-auto size-4 text-[#d9ff52]" />
              ) : (
                entry.rank
              )}
            </span>
            <span className="flex-1 truncate font-bold">{entry.nickname}</span>
            <span className="font-black tabular-nums">{entry.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
