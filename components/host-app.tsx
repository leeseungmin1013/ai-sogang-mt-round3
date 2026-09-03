'use client';

import { useEffect, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  CircleStop,
  Eye,
  FastForward,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ErrorBanner, GameHeader, LoadingGame } from '@/components/game-header';
import { gamePost, useGame } from '@/hooks/use-game';
import type { PublicGameState } from '@/lib/game-types';

const statusLabel: Record<string, string> = {
  LOBBY: '참가자 입장 중',
  QUESTION_OPEN: '답변 접수 중',
  SUBMISSION_LOCKED: '답변 마감',
  AI_GENERATING: 'OpenAI 답변 생성 중',
  ANSWER_READY: '결과 공개 대기',
  ANSWER_REVEALED: 'AI 답변 공개',
  LEADERBOARD: '리더보드 공개',
  FINISHED: '게임 종료',
};

export function HostApp({ code }: { code: string }) {
  const [hostCode, setHostCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const {
    state,
    error: stateError,
    loading,
    refresh,
    setState,
  } = useGame(code, false, authenticated ? hostCode : '');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(30);
  const [untimed, setUntimed] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(`host-code:${code}`);
    if (saved) {
      setHostCode(saved);
      setAuthenticated(true);
    }
  }, [code]);

  async function command(name: string) {
    if (
      name === 'reset' &&
      !window.confirm('참가자와 모든 점수를 삭제하고 처음부터 시작할까요?')
    )
      return;
    setBusy(name);
    setMessage('');
    try {
      const next = await gamePost<PublicGameState>(
        code,
        {
          action: 'host',
          command: name,
          durationSeconds: untimed ? null : duration,
        },
        { 'x-host-code': hostCode },
      );
      window.sessionStorage.setItem(`host-code:${code}`, hostCode);
      setAuthenticated(true);
      setState(next);
    } catch (caught) {
      setMessage(
        caught instanceof Error
          ? caught.message
          : '명령을 실행하지 못했습니다.',
      );
      if ((caught as Error)?.message.includes('코드')) setAuthenticated(false);
    } finally {
      setBusy('');
      await refresh();
    }
  }

  if (loading || !state)
    return (
      <main className="min-h-screen">
        <GameHeader code={code} label="HOST" />
        <LoadingGame />
      </main>
    );

  if (!authenticated)
    return (
      <main className="min-h-screen">
        <GameHeader code={code} label="HOST" />
        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-5 pb-20">
          <div className="w-full rounded-[30px] border border-white/10 bg-white/5 p-7">
            <LockKeyhole className="size-7 text-primary" />
            <h1 className="mt-4 text-2xl font-black">사회자 인증</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              운영 코드로 게임 진행 화면을 엽니다.
            </p>
            <ErrorBanner message={message || stateError} />
            <Input
              type="password"
              value={hostCode}
              onChange={(event) => setHostCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void command('open_lobby');
              }}
              placeholder="운영 코드"
              className="mt-6 h-12 rounded-2xl bg-white/5 px-4"
            />
            <Button
              onClick={() => void command('open_lobby')}
              disabled={!hostCode || Boolean(busy)}
              className="mt-3 h-12 w-full rounded-2xl font-black"
            >
              운영 화면 열기
            </Button>
            <p className="mt-4 text-xs text-white/35">
              로컬 기본 코드는 SOGANG2026이며, 배포 시 변경할 수 있습니다.
            </p>
          </div>
        </section>
      </main>
    );

  const question = state.currentQuestion;
  return (
    <main className="min-h-screen pb-12">
      <GameHeader code={code} label="HOST" />
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 pt-4 lg:grid-cols-[1.15fr_.85fr] sm:px-8">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-xs font-bold text-white/40">현재 상태</p>
              <p className="mt-1 font-black text-[#d9ff52]">
                {statusLabel[state.status]}
              </p>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-xs text-white/40">참가자</p>
                <p className="mt-1 font-black">{state.participantCount}명</p>
              </div>
              <div>
                <p className="text-xs text-white/40">제출</p>
                <p className="mt-1 font-black">{state.submissionCount}명</p>
              </div>
            </div>
          </div>
          <ErrorBanner message={message || stateError} />

          <div className="mt-4 min-h-[380px] rounded-[30px] border border-white/10 bg-[#17171d] p-6 sm:p-8">
            {question ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-[.16em] text-primary">
                    QUESTION {question.order} / 10
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {statusLabel[state.status]}
                  </span>
                </div>
                <h1 className="mt-5 text-2xl font-black leading-tight tracking-[-.03em] sm:text-3xl">
                  {question.prompt}
                </h1>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => (
                    <div
                      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.035] p-3"
                      key={option.key}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/8 font-black">
                        {option.key}
                      </span>
                      <span className="text-sm font-bold">{option.text}</span>
                    </div>
                  ))}
                </div>
                {state.answer && (
                  <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/10 p-4">
                    <p className="text-xs font-black text-primary">
                      AI ANSWER ·{' '}
                      {state.answer.source === 'live' ? 'LIVE API' : 'BACKUP'}
                    </p>
                    <p className="mt-2 font-black">
                      {state.answer.choice}. {state.answer.choiceText}
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      {state.answer.reason}
                    </p>
                  </div>
                )}
                {state.roundResults.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black">참가자별 답변 · 점수</p>
                      <p className="text-xs text-white/35">
                        총 {state.roundResults.length}명
                      </p>
                    </div>
                    <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                      {state.roundResults.map((result) => (
                        <div
                          className="rounded-2xl border border-white/8 bg-black/15 p-3"
                          key={result.participantId}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-xs font-black text-white/35">
                              {result.rank}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-black">
                              {result.nickname}
                            </span>
                            <span className="grid size-7 place-items-center rounded-lg bg-white/8 text-xs font-black">
                              {result.choice}
                            </span>
                            <span className="text-sm font-black tabular-nums text-[#d9ff52]">
                              {result.totalScore}점
                            </span>
                          </div>
                          <p className="mt-2 pl-7 text-xs leading-5 text-white/55">
                            {result.reason}
                          </p>
                          <div className="mt-2 flex justify-end gap-3 text-[11px] font-bold text-white/40">
                            <span>선택 +{result.choiceScore}</span>
                            <span>이유 유사도 +{result.semanticScore}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid min-h-[310px] place-items-center text-center">
                <div>
                  <Bot className="mx-auto size-10 text-white/25" />
                  <h1 className="mt-4 text-2xl font-black">
                    Round 3 준비 완료
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    참가자가 모두 들어오면 첫 문제를 시작하세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <h2 className="font-black">진행 컨트롤</h2>
            <div className="mt-4 rounded-2xl bg-black/20 p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">시간 제한 없음</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    사회자가 마감할 때까지 답변을 받습니다.
                  </p>
                </div>
                <Switch
                  checked={untimed}
                  onCheckedChange={setUntimed}
                  aria-label="답변 시간 제한 없음"
                />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                <span className="text-sm text-muted-foreground">답변 시간</span>
                <div className="flex items-center gap-2">
                  <button
                    className="mini-control"
                    onClick={() => setDuration(Math.max(10, duration - 10))}
                    disabled={untimed}
                    aria-label="답변 시간 10초 줄이기"
                  >
                    −
                  </button>
                  <span
                    className={`w-20 whitespace-nowrap text-center text-sm font-black tabular-nums ${untimed ? 'text-white/35' : ''}`}
                  >
                    {untimed
                      ? '무제한'
                      : duration >= 60
                        ? `${Math.floor(duration / 60)}분${duration % 60 ? ` ${duration % 60}초` : ''}`
                        : `${duration}초`}
                  </span>
                  <button
                    className="mini-control"
                    onClick={() => setDuration(Math.min(300, duration + 10))}
                    disabled={untimed}
                    aria-label="답변 시간 10초 늘리기"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {state.status === 'LOBBY' && (
                <ControlButton
                  icon={Play}
                  label="1번 문제 시작"
                  onClick={() => command('start')}
                  busy={busy === 'start'}
                />
              )}
              {state.status === 'QUESTION_OPEN' && (
                <ControlButton
                  icon={CircleStop}
                  label="답변 마감"
                  onClick={() => command('lock')}
                  busy={busy === 'lock'}
                  tone="danger"
                />
              )}
              {state.status === 'SUBMISSION_LOCKED' && (
                <ControlButton
                  icon={Sparkles}
                  label="OpenAI에게 질문하기"
                  onClick={() => command('generate')}
                  busy={busy === 'generate'}
                />
              )}
              {state.status === 'AI_GENERATING' && (
                <ControlButton
                  icon={Sparkles}
                  label="생성 상태 다시 확인"
                  onClick={() => command('generate')}
                  busy={busy === 'generate'}
                />
              )}
              {state.status === 'ANSWER_READY' && (
                <ControlButton
                  icon={Eye}
                  label="AI 답변과 참가자 결과 공개"
                  onClick={() => command('reveal')}
                  busy={busy === 'reveal'}
                />
              )}
              {state.status === 'ANSWER_REVEALED' && (
                <>
                  <ControlButton
                    icon={Trophy}
                    label={
                      question?.order === 10
                        ? '최종 리더보드 공개'
                        : '누적 리더보드 공개'
                    }
                    onClick={() => command('leaderboard')}
                    busy={busy === 'leaderboard'}
                  />
                  {question?.order !== 10 && (
                    <ControlButton
                      icon={FastForward}
                      label="다음 문제로 바로 이동 · 순위 미공개"
                      onClick={() => command('next')}
                      busy={busy === 'next'}
                      tone="secondary"
                    />
                  )}
                </>
              )}
              {state.status === 'LEADERBOARD' && (
                <ControlButton
                  icon={FastForward}
                  label={
                    question?.order === 10 ? '게임 종료' : '다음 문제 시작'
                  }
                  onClick={() => command('next')}
                  busy={busy === 'next'}
                />
              )}
              {state.status === 'FINISHED' && (
                <div className="rounded-2xl bg-[#d9ff52]/10 p-4 text-center text-sm font-black text-[#d9ff52]">
                  <CheckCircle2 className="mx-auto mb-2 size-5" />
                  게임이 종료되었습니다.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black">누적 TOP 5</h2>
              <Users className="size-4 text-white/35" />
            </div>
            <div className="mt-3 space-y-2">
              {state.leaderboard.slice(0, 5).map((entry) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-black/15 px-3 py-2"
                  key={entry.participantId}
                >
                  <span className="w-5 text-center text-xs font-black text-white/35">
                    {entry.rank}
                  </span>
                  <span className="flex-1 truncate text-sm font-bold">
                    {entry.nickname}
                  </span>
                  <span className="font-black tabular-nums">{entry.score}</span>
                </div>
              ))}
              {!state.leaderboard.length && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  리더보드를 공개하면 여기에 표시됩니다.
                </p>
              )}
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => void command('reset')}
            disabled={Boolean(busy)}
            className="h-11 w-full rounded-2xl"
          >
            <RotateCcw className="size-4" /> 게임 초기화
          </Button>
        </aside>
      </div>
    </main>
  );
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  busy,
  tone,
}: {
  icon: typeof Play;
  label: string;
  onClick: () => Promise<void>;
  busy: boolean;
  tone?: string;
}) {
  return (
    <Button
      onClick={() => void onClick()}
      disabled={busy}
      className={`h-13 w-full rounded-2xl text-base font-black ${tone === 'danger' ? 'bg-red-400 text-red-950 hover:bg-red-300' : tone === 'secondary' ? 'border border-white/12 bg-white/5 text-white hover:bg-white/10' : ''}`}
    >
      <Icon className="size-4" />
      {busy ? '처리하는 중...' : label}
    </Button>
  );
}
