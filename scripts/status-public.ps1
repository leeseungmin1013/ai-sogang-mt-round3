$projectRoot = Split-Path -Parent $PSScriptRoot
$statePath = Join-Path $projectRoot '.runtime\state.json'

if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) {
  Write-Host '현재 실행 중이 아닙니다.' -ForegroundColor Yellow
  exit 0
}

try {
  $state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
  $serverAlive = $null -ne (Get-Process -Id ([int]$state.serverPid) -ErrorAction SilentlyContinue)
  $tunnelAlive = $null -ne (Get-Process -Id ([int]$state.tunnelPid) -ErrorAction SilentlyContinue)

  if ($serverAlive -and $tunnelAlive) {
    Write-Host '정상 실행 중입니다.' -ForegroundColor Green
    Write-Host ('참가자: ' + $state.publicUrl + '/play/MT2026')
    Write-Host ('발표:   ' + $state.publicUrl + '/screen/MT2026')
    Write-Host ('사회자: ' + $state.publicUrl + '/host/MT2026')
  } else {
    Write-Host '일부 프로세스가 종료되어 있습니다. 종료 파일 실행 후 다시 시작해 주세요.' -ForegroundColor Red
  }
} catch {
  Write-Host '상태 파일을 읽을 수 없습니다. 종료 파일 실행 후 다시 시작해 주세요.' -ForegroundColor Red
}
