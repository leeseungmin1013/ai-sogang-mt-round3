import Link from 'next/link';
import { Bot, Wifi } from 'lucide-react';

export function GameHeader({ code, label }: { code: string; label?: string }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Bot className="size-5" />
        </span>
        <div>
          <p className="text-sm font-black">AI@Sogang</p>
          <p className="text-[11px] text-muted-foreground">
            ROUND 03 · {label ?? 'LIVE'}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70">
        <Wifi className="size-3.5 text-[#d9ff52]" /> {code}
      </div>
    </header>
  );
}

export function LoadingGame() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto size-9 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          게임에 연결하는 중...
        </p>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100"
    >
      {message}
    </div>
  );
}
