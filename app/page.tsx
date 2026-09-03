import {
  ArrowRight,
  Bot,
  MonitorPlay,
  Settings2,
  Smartphone,
  Sparkles,
} from 'lucide-react';

const roles = [
  {
    icon: Smartphone,
    eyebrow: 'PLAYER',
    title: '참가자 입장',
    description: 'AI의 선택과 이유를 예측하고 실시간 순위를 확인하세요.',
    href: '/play/MT2026',
    tone: 'coral',
  },
  {
    icon: MonitorPlay,
    eyebrow: 'LIVE SCREEN',
    title: '발표 화면',
    description: '프로젝터에서 질문, AI 답변, 리더보드를 크게 보여줍니다.',
    href: '/screen/MT2026',
    tone: 'violet',
  },
  {
    icon: Settings2,
    eyebrow: 'HOST ONLY',
    title: '사회자 콘솔',
    description: '질문 공개, 답변 마감, AI 호출과 순위 공개를 진행합니다.',
    href: '/host/MT2026',
    tone: 'lime',
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Bot className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-black tracking-tight">AI@Sogang</p>
            <p className="text-xs text-muted-foreground">3기 MT Recreation</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70 backdrop-blur">
          ROUND 03
        </span>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-6xl content-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            Live AI prediction game
          </div>
          <h1 className="max-w-3xl text-balance text-5xl font-black leading-[.98] tracking-[-.055em] sm:text-7xl">
            AI의 대답을
            <br />
            <span className="gradient-text">예측해 보세요.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            모두의 답변이 모이면 OpenAI가 같은 질문에 직접 답합니다. 선택을
            맞히고, 이유까지 닮을수록 더 높은 점수를 얻습니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="primary-cta" href="/play/MT2026">
              방 코드 MT2026으로 입장
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <span className="text-sm text-muted-foreground">
              가입 없이 닉네임만 입력하면 됩니다.
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {roles.map(
            ({ icon: Icon, eyebrow, title, description, href, tone }) => (
              <a
                className={`group role-card role-${tone}`}
                href={href}
                key={title}
              >
                <div className="role-icon">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black tracking-[.18em] text-white/45">
                    {eyebrow}
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {description}
                  </p>
                </div>
                <ArrowRight
                  className="mt-2 size-5 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-white"
                  aria-hidden="true"
                />
              </a>
            ),
          )}

          <div className="rounded-[28px] border border-white/10 bg-white/[.045] p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white/45">점수 구성</p>
                <p className="mt-1 font-black">선택 예측 70 + 이유 유사도 30</p>
              </div>
              <div className="grid size-14 place-items-center rounded-2xl bg-[#d9ff52] text-lg font-black text-[#101014]">
                100
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
