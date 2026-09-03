import { PlayerApp } from '@/components/player-app';

export default async function PlayPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <PlayerApp code={code.toUpperCase()} />;
}
