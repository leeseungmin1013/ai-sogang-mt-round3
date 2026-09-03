'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PublicGameState } from '@/lib/game-types';

export function useGame(code: string, withParticipant = false) {
  const [state, setState] = useState<PublicGameState | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const token = withParticipant
        ? window.localStorage.getItem(`game-token:${code}`)
        : null;
      const response = await fetch(`/api/game/${encodeURIComponent(code)}`, {
        cache: 'no-store',
        headers: token ? { 'x-participant-token': token } : undefined,
      });
      const payload = (await response.json()) as PublicGameState & {
        error?: string;
      };
      if (!response.ok)
        throw new Error(payload.error || '게임 상태를 불러오지 못했습니다.');
      if (mounted.current) {
        setState(payload);
        setError('');
        setLoading(false);
      }
    } catch (caught) {
      if (mounted.current) {
        setError(
          caught instanceof Error ? caught.message : '연결을 확인해 주세요.',
        );
        setLoading(false);
      }
    }
  }, [code, withParticipant]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const timer = window.setInterval(() => void refresh(), 1500);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      mounted.current = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  return { state, error, loading, refresh, setState };
}

export async function gamePost<T>(
  code: string,
  body: object,
  headers?: Record<string, string>,
) {
  const response = await fetch(`/api/game/${encodeURIComponent(code)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new Error(payload.error || '요청을 처리하지 못했습니다.');
  return payload;
}
