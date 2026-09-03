'use client';

import { useEffect, useState } from 'react';
import {
  Bot,
  Crown,
  LoaderCircle,
  MessageSquareText,
  Sparkles,
  Users,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '@/hooks/use-game';
import { LoadingGame } from '@/components/game-header';

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

export function ScreenApp({ code }: { code: string }) {
  const { state, loading } = useGame(code);
  const [joinUrl, setJoinUrl] = useState('');
  const [resultPage, setResultPage] = useState(0);
  const remaining = useCountdown(state?.closesAt);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setJoinUrl(`${window.location.origin}/play/${code}`),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [code]);
  useEffect(() => {
    if (state?.status !== 'ANSWER_REVEALED') {
      const reset = window.setTimeout(() => setResultPage(0), 0);
      return () => window.clearTimeout(reset);
    }
    const pageCount = Math.max(1, Math.ceil(state.roundResults.length / 4));
    const normalize = window.setTimeout(
      () => setResultPage((page) => page % pageCount),
      0,
    );
    if (pageCount === 1) return () => window.clearTimeout(normalize);
    const timer = window.setInterval(
      () => setResultPage((page) => (page + 1) % pageCount),
      6000,
    );
    return () => {
      window.clearTimeout(normalize);
      window.clearInterval(timer);
    };
  }, [state?.status, state?.currentQuestion?.order, state?.roundResults.length]);
  if (loading || !state)
    return (
      <main className="screen-stage">
        <LoadingGame />
      </main>
    );

  const question = state.currentQuestion;
  const resultPageCount = Math.max(
    1,
    Math.ceil(state.roundResults.length / 4),
  );
  const visibleRoundResults = state.roundResults.slice(
    resultPage * 4,
    resultPage * 4 + 4,
  );
  return (
    <main className="screen-stage">
      <div className="screen-grid" />
      <header className="relative z-10 flex items-center justify-between px-[4vw] py-[3vh]">
        <div className="flex items-center gap-3">
          <span className="grid size-[3.2vw] min-h-10 min-w-10 place-items-center rounded-[1vw] bg-primary text-primary-foreground">
            <Bot className="size-[1.6vw] min-h-5 min-w-5" />
          </span>
          <div>
            <p className="text-[1.1vw] font-black">AI@Sogang</p>
            <p className="text-[.72vw] tracking-[.18em] text-white/40">
              ROUND 03 · LIVE
            </p>
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-[1.1vw] py-[.55vw] text-[.85vw] font-black">
          ROOM {code}
        </div>
      </header>

      {state.status === 'LOBBY' && (
        <section className="screen-center grid grid-cols-[1.2fr_.8fr] items-center gap-[5vw]">
          <div>
            <p className="text-[1.1vw] font-black tracking-[.2em] text-primary">
              ROUND 03
            </p>
            <h1 className="mt-[1.2vw] text-[5.4vw] font-black leading-[.94] tracking-[-.06em]">
              AI의 대답을
              <br />
              <span className="gradient-text">예측해 보세요.</span>
            </h1>
            <p className="mt-[2vw] text-[1.35vw] leading-relaxed text-white/55">
              휴대폰 카메라로 QR 코드를 찍고
              <br />
              닉네임을 입력하면 바로 참가할 수 있습니다.
            </p>
            <div className="mt-[2vw] inline-flex items-center gap-2 rounded-full bg-white/7 px-[1.2vw] py-[.7vw] text-[1vw] font-bold">
              <Users className="size-[1.2vw]" /> {state.participantCount}명 입장
              완료
            </div>
          </div>
          <div className="rounded-[2.4vw] bg-white p-[2vw] text-center text-[#111116] shadow-[0_2vw_8vw_rgb(0_0_0/35%)]">
            {joinUrl && (
              <QRCodeSVG
                value={joinUrl}
                size={320}
                level="M"
                className="h-auto w-full"
              />
            )}
            <p className="mt-[1.3vw] text-[1.05vw] font-black">
              {joinUrl.replace(/^https?:\/\//, '')}
            </p>
            <p className="mt-[.4vw] text-[.8vw] font-bold text-black/45">
              방 코드 {code}
            </p>
          </div>
        </section>
      )}

      {state.status === 'QUESTION_OPEN' && question && (
        <section className="screen-center">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-[1vw] py-[.45vw] text-[.85vw] font-black text-primary">
              QUESTION {question.order} / 10
            </span>
            {state.closesAt ? (
              <span
                className={`text-[2vw] font-black tabular-nums ${remaining <= 5 ? 'text-red-300' : 'text-[#d9ff52]'}`}
              >
                {remaining}초
              </span>
            ) : (
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-[1.1vw] py-[.55vw] text-[1.05vw] font-black text-cyan-200">
                시간 제한 없음 · 사회자 마감까지
              </span>
            )}
          </div>
          <h1 className="mt-[2.2vw] max-w-[88%] text-balance text-[3vw] font-black leading-tight tracking-[-.035em]">
            {question.prompt}
          </h1>
          <div className="mt-[2.2vw] grid grid-cols-2 gap-[1vw]">
            {question.options.map((option) => (
              <div
                className="flex min-h-[5.2vw] items-center gap-[1.1vw] rounded-[1.4vw] border border-white/10 bg-white/5 px-[1.3vw] py-[1vw]"
                key={option.key}
              >
                <span className="grid size-[2.6vw] shrink-0 place-items-center rounded-[.8vw] bg-white/10 text-[1.1vw] font-black">
                  {option.key}
                </span>
                <span className="text-[1.2vw] font-bold leading-snug">
                  {option.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-[2vw] flex items-center justify-between border-t border-white/10 pt-[1.2vw]">
            <p className="text-[1vw] text-white/45">
              선택 70점 + 이유 유사도 30점
            </p>
            <p className="flex items-center gap-2 text-[1.1vw] font-black">
              <Users className="size-[1.2vw] text-primary" />{' '}
              {state.submissionCount} / {state.participantCount} 제출
            </p>
          </div>
        </section>
      )}

      {['SUBMISSION_LOCKED', 'AI_GENERATING', 'ANSWER_READY'].includes(
        state.status,
      ) && (
        <section className="screen-center grid place-items-center text-center">
          <div>
            <div className="mx-auto grid size-[7vw] place-items-center rounded-[2.2vw] bg-violet-400/10 text-violet-300">
              <LoaderCircle className="size-[3.2vw] animate-spin" />
            </div>
            <p className="mt-[2vw] text-[1vw] font-black tracking-[.2em] text-violet-300">
              OPENAI IS THINKING
            </p>
            <h1 className="mt-[.7vw] text-[4vw] font-black tracking-[-.05em]">
              AI에게 같은 질문을
              <br />
              묻고 있습니다.
            </h1>
            <p className="mt-[1.3vw] text-[1.2vw] text-white/45">
              {state.submissionCount}개의 답변을 잠그고 결과를 계산합니다.
            </p>
          </div>
        </section>
      )}

      {state.status === 'ANSWER_REVEALED' && state.answer && (
        <section className="screen-center">
          <div className="relative overflow-hidden rounded-[2vw] border border-cyan-300/40 bg-[linear-gradient(120deg,rgba(34,211,238,.18),rgba(59,130,246,.16)_58%,rgba(139,92,246,.1))] px-[2vw] py-[1.5vw] shadow-[0_0_5vw_rgba(34,211,238,.13)]">
            <div className="absolute -right-[5vw] -top-[7vw] size-[18vw] rounded-full bg-cyan-300/15 blur-[4vw]" />
            <div className="relative flex items-center justify-between">
              <p className="flex items-center gap-[.6vw] text-[1vw] font-black tracking-[.15em] text-cyan-200">
                <Sparkles className="size-[1.2vw]" /> AI FINAL ANSWER
              </p>
              <div className="flex items-center gap-[.55vw]">
                <span className="rounded-full border border-white/10 bg-black/20 px-[.8vw] py-[.38vw] text-[.7vw] font-black text-white/50">
                  선택 70 + 이유 30
                </span>
                <span className="rounded-full bg-[#d9ff52] px-[.8vw] py-[.38vw] text-[.7vw] font-black text-[#101014]">
                  {state.answer.source === 'live' ? 'LIVE API' : 'BACKUP'}
                </span>
              </div>
            </div>
            <div className="relative mt-[1vw] grid grid-cols-[5.6vw_minmax(0,.9fr)_minmax(0,1.35fr)] items-center gap-[1.4vw]">
              <span className="grid size-[5.6vw] place-items-center rounded-[1.5vw] bg-cyan-300 text-[3vw] font-black leading-none text-[#07151b] shadow-[0_.8vw_2.5vw_rgba(34,211,238,.25)]">
                {state.answer.choice}
              </span>
              <h1 className="text-balance text-[2.5vw] font-black leading-[1.05] tracking-[-.045em]">
                {state.answer.choiceText}
              </h1>
              <div className="border-l border-white/15 pl-[1.4vw]">
                <p className="text-[.7vw] font-black tracking-[.14em] text-white/35">
                  AI가 선택한 이유
                </p>
                <p className="mt-[.45vw] text-[1.25vw] font-bold leading-[1.45] text-white/85">
                  “{state.answer.reason}”
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[1.1vw] rounded-[1.7vw] border border-white/10 bg-white/5 p-[1.25vw]">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[.9vw] font-black">
                <MessageSquareText className="size-[1vw] text-[#d9ff52]" />
                참가자별 답변 · 점수
              </p>
              {resultPageCount > 1 && (
                <p className="text-[.68vw] font-black tabular-nums text-white/35">
                  {resultPage + 1} / {resultPageCount} · 6초마다 전환
                </p>
              )}
            </div>
            <div className="mt-[.65vw] space-y-[.38vw]">
              {visibleRoundResults.map((result) => (
                <div
                  className={`grid grid-cols-[1.4vw_7vw_2.1vw_minmax(0,1fr)_3.7vw_3.7vw_4vw] items-center gap-[.55vw] rounded-[.8vw] border px-[.8vw] py-[.42vw] ${result.rank <= 3 ? 'border-[#d9ff52]/15 bg-[#d9ff52]/6' : 'border-white/5 bg-black/15'}`}
                  key={result.participantId}
                >
                  <span className="text-center text-[.78vw] font-black text-white/35">
                    {result.rank}
                  </span>
                  <span className="truncate text-[.85vw] font-black">
                    {result.nickname}
                  </span>
                  <span className="grid size-[1.65vw] place-items-center rounded-[.5vw] bg-white/9 text-[.75vw] font-black">
                    {result.choice}
                  </span>
                  <span className="line-clamp-1 text-[.7vw] leading-[1.35] text-white/55">
                    {result.reason}
                  </span>
                  <ScorePart label="선택" score={result.choiceScore} />
                  <ScorePart label="유사도" score={result.semanticScore} />
                  <span className="text-right text-[.95vw] font-black tabular-nums text-[#d9ff52]">
                    {result.totalScore}점
                  </span>
                </div>
              ))}
              {!visibleRoundResults.length && (
                <div className="grid min-h-[8vw] place-items-center text-[.85vw] text-white/35">
                  제출된 참가자 답변이 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {['LEADERBOARD', 'FINISHED'].includes(state.status) && (
        <section className="screen-center">
          <div className="text-center">
            <p className="text-[1vw] font-black tracking-[.2em] text-[#d9ff52]">
              {state.status === 'FINISHED'
                ? 'FINAL RESULT'
                : `AFTER QUESTION ${question?.order ?? 0}`}
            </p>
            <h1 className="mt-[.5vw] text-[3.5vw] font-black tracking-[-.05em]">
              누적 리더보드
            </h1>
          </div>
          <div className="mx-auto mt-[1.8vw] max-w-[72vw] overflow-hidden rounded-[2vw] border border-white/10 bg-white/5">
            {state.leaderboard.slice(0, 10).map((entry) => (
              <div
                className={`flex items-center gap-[1.2vw] border-b border-white/8 px-[1.5vw] py-[.85vw] last:border-b-0 ${entry.rank <= 3 ? 'bg-[#d9ff52]/5' : ''}`}
                key={entry.participantId}
              >
                <span className="grid w-[2.5vw] place-items-center text-[1.05vw] font-black text-white/40">
                  {entry.rank === 1 ? (
                    <Crown className="size-[1.4vw] text-[#d9ff52]" />
                  ) : (
                    entry.rank
                  )}
                </span>
                <span className="flex-1 text-[1.25vw] font-black">
                  {entry.nickname}
                </span>
                <span className="text-[1.3vw] font-black tabular-nums">
                  {entry.score}
                  <small className="ml-1 text-[.7vw] text-white/35">점</small>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ScorePart({ label, score }: { label: string; score: number }) {
  return (
    <span className="text-right">
      <small className="block text-[.55vw] font-bold text-white/30">{label}</small>
      <strong className="text-[.78vw] font-black tabular-nums">+{score}</strong>
    </span>
  );
}
