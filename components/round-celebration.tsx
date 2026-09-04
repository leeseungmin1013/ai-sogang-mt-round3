import type { CSSProperties } from 'react';

const COLORS = ['#67e8f9', '#d9ff52', '#a78bfa', '#fcd34d'];

export function RoundCelebration() {
  return (
    <div className="relative mb-4 overflow-hidden rounded-[28px] border border-cyan-300/30 bg-cyan-300/10 px-5 py-6 text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 32 }, (_, index) => {
          const angle = (index / 32) * Math.PI * 2;
          const distance = 95 + (index % 4) * 30;
          return (
            <span
              key={index}
              className="round-confetti"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
                '--burst-x': `${Math.cos(angle) * distance}px`,
                '--burst-y': `${Math.sin(angle) * distance}px`,
                '--burst-turn': `${180 + index * 37}deg`,
                animationDelay: `${(index % 4) * 90}ms`,
              } as CSSProperties}
            />
          );
        })}
      </div>
      <div className="relative" role="status">
        <span className="text-4xl" aria-hidden="true">🎉 🏆 🎉</span>
        <p className="mt-2 text-xl font-black text-cyan-100">이번 문제 1등! 축하해요!</p>
        <p className="mt-1 text-sm text-cyan-100/70">AI의 마음을 멋지게 읽었네요.</p>
      </div>
    </div>
  );
}
