import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  GameError,
  getPublicState,
  hostCommand,
  joinGame,
  submitAnswer,
  verifyHostCode,
} from '@/db/game';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const joinSchema = z.object({
  action: z.literal('join'),
  nickname: z.string().min(2).max(16),
});
const submitSchema = z.object({
  action: z.literal('submit'),
  choice: z.string().min(1).max(1),
  reason: z.string().min(5).max(120),
});
const hostSchema = z.object({
  action: z.literal('host'),
  command: z.enum([
    'open_lobby',
    'start',
    'lock',
    'generate',
    'reveal',
    'leaderboard',
    'next',
    'finish',
    'reset',
  ]),
  durationSeconds: z.number().int().min(10).max(300).nullable().optional(),
});

function errorResponse(error: unknown) {
  if (error instanceof GameError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  if (error instanceof z.ZodError)
    return NextResponse.json(
      { error: error.issues[0]?.message ?? '입력값을 확인해 주세요.' },
      { status: 400 },
    );
  console.error(error);
  return NextResponse.json(
    { error: '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' },
    { status: 500 },
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await context.params;
    const token = request.headers.get('x-participant-token');
    const hostCode = request.headers.get('x-host-code');
    if (hostCode) verifyHostCode(hostCode);
    const state = await getPublicState(code, token, Boolean(hostCode));
    return NextResponse.json(state, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await context.params;
    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null || !('action' in body))
      throw new GameError('올바르지 않은 요청입니다.', 400);
    const action = (body as { action: unknown }).action;

    if (action === 'join') {
      const input = joinSchema.parse(body);
      return NextResponse.json(await joinGame(code, input.nickname), {
        status: 201,
      });
    }

    if (action === 'submit') {
      const input = submitSchema.parse(body);
      const token = request.headers.get('x-participant-token');
      return NextResponse.json(
        await submitAnswer(code, token, input.choice, input.reason),
      );
    }

    if (action === 'host') {
      const input = hostSchema.parse(body);
      verifyHostCode(request.headers.get('x-host-code'));
      const state = await hostCommand(
        code,
        input.command,
        input.durationSeconds,
      );
      return NextResponse.json(state);
    }

    throw new GameError('지원하지 않는 요청입니다.', 400);
  } catch (error) {
    return errorResponse(error);
  }
}
