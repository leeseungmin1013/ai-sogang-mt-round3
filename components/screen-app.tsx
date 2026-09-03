'use client';

import { useEffect, useState } from 'react';
import {
  Bot,
  Crown,
  LoaderCircle,
  Sparkles,
  Trophy,
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
  const remaining = useCountdown(state?.closesAt);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setJoinUrl(`${window.location.origin}/play/${code}`),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [code]);
  if (loading || !state)
    return (
      <main className="screen-stage">
        <LoadingGame />
      </main>
    );

  const question = state.currentQuestion;
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
            <span
              className={`text-[2vw] font-black tabular-nums ${remaining <= 5 ? 'text-red-300' : 'text-[#d9ff52]'}`}
            >
              {remaining}s
            </span>
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
          <div className="grid grid-cols-[.95fr_1.05fr] gap-[2vw]">
            <div className="rounded-[2vw] border border-primary/25 bg-primary/10 p-[2.2vw]">
              <p className="flex items-center gap-2 text-[1vw] font-black text-primary">
                <Sparkles className="size-[1.1vw]" /> OPENAI의 선택
              </p>
              <div className="mt-[1.5vw] flex items-start gap-[1.3vw]">
                <span className="grid size-[4.2vw] shrink-0 place-items-center rounded-[1.3vw] bg-primary text-[2vw] font-black text-primary-foreground">
                  {state.answer.choice}
                </span>
                <div>
                  <h1 className="text-[2vw] font-black">
                    {state.answer.choiceText}
                  </h1>
                  <p className="mt-[1vw] text-[1.25vw] leading-relaxed text-white/65">
                    {state.answer.reason}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[2vw] border border-white/10 bg-white/5 p-[2vw]">
              <p className="flex items-center gap-2 text-[1vw] font-black">
                <Trophy className="size-[1.1vw] text-[#d9ff52]" /> 이번 문제 TOP
                5
              </p>
              <div className="mt-[1vw] space-y-[.55vw]">
                {state.roundResults.slice(0, 5).map((result) => (
                  <div
                    className="flex items-center gap-[.8vw] rounded-[.9vw] bg-black/15 px-[1vw] py-[.65vw]"
                    key={result.participantId}
                  >
                    <span className="w-[1.7vw] text-center text-[.9vw] font-black text-white/35">
                      {result.rank}
                    </span>
                    <span className="flex-1 truncate text-[1vw] font-bold">
                      {result.nickname}
                    </span>
                    <span className="text-[1.05vw] font-black">
                      {result.totalScore}점
                    </span>
                  </div>
                ))}
              </div>
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
