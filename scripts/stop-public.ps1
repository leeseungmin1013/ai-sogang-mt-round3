$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $projectRoot '.runtime'
$statePath = Join-Path $runtimeDir 'state.json'

function Stop-TrackedProcess([int]$ProcessId, [string]$Label) {
  if ($ProcessId -le 0) { return }
  $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
  if ($process) {
    Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
    Write-Host ($Label + ' 종료 완료') -ForegroundColor Green
  }
}

if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) {
  Write-Host '실행 기록이 없습니다. 이미 종료된 상태일 수 있습니다.' -ForegroundColor Yellow
  exit 0
}

try {
  $state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
  Stop-TrackedProcess ([int]$state.tunnelPid) '공개 터널'
  Stop-TrackedProcess ([int]$state.serverPid) '게임 서버'
  Stop-TrackedProcess ([int]$state.serverLauncherPid) '서버 실행기'
  Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
  Write-Host 'AI@Sogang MT Round 3가 종료됐습니다.' -ForegroundColor Cyan
} catch {
  throw '종료 중 오류가 발생했습니다. .runtime/state.json을 확인해 주세요.'
}
