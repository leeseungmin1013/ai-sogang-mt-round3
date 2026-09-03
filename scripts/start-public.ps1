$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDir = Join-Path $projectRoot '.runtime'
$statePath = Join-Path $runtimeDir 'state.json'
$serverLog = Join-Path $runtimeDir 'server.log'
$serverErrorLog = Join-Path $runtimeDir 'server-error.log'
$tunnelLog = Join-Path $runtimeDir 'tunnel.log'
$tunnelErrorLog = Join-Path $runtimeDir 'tunnel-error.log'
$envPath = Join-Path $projectRoot '.env.local'

function Test-ProcessAlive([int]$ProcessId) {
  return $null -ne (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)
}

function Stop-TrackedProcess([int]$ProcessId) {
  if ($ProcessId -gt 0 -and (Test-ProcessAlive $ProcessId)) {
    Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
  }
}

if (-not (Test-Path -LiteralPath $runtimeDir -PathType Container)) {
  New-Item -ItemType Directory -Path $runtimeDir | Out-Null
}

if (-not (Test-Path -LiteralPath $envPath -PathType Leaf)) {
  throw '.env.local 파일이 없습니다. OPENAI_API_KEY를 먼저 저장해 주세요.'
}

$hasApiKey = Select-String -LiteralPath $envPath -Pattern '^\s*OPENAI_API_KEY\s*=\s*\S+' -Quiet
if (-not $hasApiKey) {
  throw '.env.local에 OPENAI_API_KEY가 설정되지 않았습니다.'
}

if (Test-Path -LiteralPath $statePath -PathType Leaf) {
  try {
    $existing = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
    if ((Test-ProcessAlive ([int]$existing.serverPid)) -and (Test-ProcessAlive ([int]$existing.tunnelPid))) {
      Write-Host '이미 실행 중입니다.' -ForegroundColor Yellow
      Write-Host ('참가자: ' + $existing.publicUrl + '/play/MT2026')
      Write-Host ('발표:   ' + $existing.publicUrl + '/screen/MT2026')
      Write-Host ('사회자: ' + $existing.publicUrl + '/host/MT2026')
      exit 0
    }
  } catch {
    # Stale state is replaced below.
  }
}

$occupied = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($occupied) {
  throw '3000번 포트를 다른 프로그램이 사용 중입니다. MT_GAME_STOP.cmd를 먼저 실행해 주세요.'
}

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npm) {
  throw 'npm을 찾을 수 없습니다. Node.js 설치 상태를 확인해 주세요.'
}

$cloudflared = Get-Command cloudflared.exe -ErrorAction SilentlyContinue
if (-not $cloudflared) {
  $fallbackPath = 'C:\Program Files (x86)\cloudflared\cloudflared.exe'
  if (Test-Path -LiteralPath $fallbackPath -PathType Leaf) {
    $cloudflaredPath = $fallbackPath
  } else {
    throw 'cloudflared를 찾을 수 없습니다. Cloudflare Tunnel 도구를 다시 설치해 주세요.'
  }
} else {
  $cloudflaredPath = $cloudflared.Source
}

Remove-Item -LiteralPath $serverLog, $serverErrorLog, $tunnelLog, $tunnelErrorLog -Force -ErrorAction SilentlyContinue

Write-Host '1/3 게임 서버를 시작합니다...'
$serverLauncher = Start-Process -FilePath $npm.Source -ArgumentList @('run', 'dev') -WorkingDirectory $projectRoot -RedirectStandardOutput $serverLog -RedirectStandardError $serverErrorLog -WindowStyle Hidden -PassThru

$serverPid = 0
for ($attempt = 0; $attempt -lt 60; $attempt += 1) {
  Start-Sleep -Milliseconds 500
  $listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) {
    $serverPid = [int]$listener.OwningProcess
    break
  }
  if ($serverLauncher.HasExited) {
    throw '게임 서버가 시작되지 않았습니다. .runtime/server-error.log를 확인해 주세요.'
  }
}

if ($serverPid -eq 0) {
  Stop-TrackedProcess $serverLauncher.Id
  throw '게임 서버 시작 시간이 초과됐습니다.'
}

Write-Host '2/3 공개 HTTPS 주소를 생성합니다...'
$tunnel = $null
$publicUrl = $null

for ($tunnelAttempt = 1; $tunnelAttempt -le 3; $tunnelAttempt += 1) {
  if ($tunnelAttempt -gt 1) {
    Write-Host ('접속 가능한 주소를 다시 생성합니다... (' + $tunnelAttempt + '/3)') -ForegroundColor Yellow
  }

  $attemptTunnelLog = Join-Path $runtimeDir ('tunnel-' + $tunnelAttempt + '.log')
  $attemptTunnelErrorLog = Join-Path $runtimeDir ('tunnel-' + $tunnelAttempt + '-error.log')
  Remove-Item -LiteralPath $attemptTunnelLog, $attemptTunnelErrorLog -Force -ErrorAction SilentlyContinue

  $tunnel = Start-Process -FilePath $cloudflaredPath -ArgumentList @('tunnel', '--url', 'http://localhost:3000', '--http-host-header', 'localhost:3000', '--no-autoupdate') -WorkingDirectory $projectRoot -RedirectStandardOutput $attemptTunnelLog -RedirectStandardError $attemptTunnelErrorLog -WindowStyle Hidden -PassThru

  $candidateUrl = $null
  for ($attempt = 0; $attempt -lt 90; $attempt += 1) {
    Start-Sleep -Milliseconds 500
    $combined = ''
    if (Test-Path -LiteralPath $attemptTunnelLog) { $combined += Get-Content -Raw -LiteralPath $attemptTunnelLog }
    if (Test-Path -LiteralPath $attemptTunnelErrorLog) { $combined += Get-Content -Raw -LiteralPath $attemptTunnelErrorLog }
    $match = [regex]::Match($combined, 'https://[a-z0-9-]+\.trycloudflare\.com')
    if ($match.Success) {
      $candidateUrl = $match.Value.TrimEnd('/')
      break
    }
    if ($tunnel.HasExited) { break }
  }

  $reachable = $false
  if ($candidateUrl) {
    $candidateHost = ([uri]$candidateUrl).Host
    for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
      Start-Sleep -Milliseconds 500
      try {
        $publicIp = Resolve-DnsName $candidateHost -Server 1.1.1.1 -Type A -ErrorAction Stop |
          Where-Object { $_.IPAddress } |
          Select-Object -First 1 -ExpandProperty IPAddress
        $statusCode = & curl.exe --silent --output NUL --write-out '%{http_code}' --resolve ($candidateHost + ':443:' + $publicIp) ($candidateUrl + '/')
        if ($statusCode -eq '200') {
          $reachable = $true
          break
        }
      } catch { }
    }
  }

  if ($reachable) {
    $publicUrl = $candidateUrl
    break
  }

  Stop-TrackedProcess $tunnel.Id
  $tunnel = $null
}

if (-not $publicUrl) {
  if ($tunnel) { Stop-TrackedProcess $tunnel.Id }
  Stop-TrackedProcess $serverPid
  Stop-TrackedProcess $serverLauncher.Id
  throw '접속 가능한 공개 주소를 만들지 못했습니다. 잠시 후 시작 파일을 다시 실행해 주세요.'
}

$state = [ordered]@{
  serverLauncherPid = $serverLauncher.Id
  serverPid = $serverPid
  tunnelPid = $tunnel.Id
  publicUrl = $publicUrl
  startedAt = (Get-Date).ToString('o')
}
$state | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding UTF8

$participantUrl = $publicUrl + '/play/MT2026'
$screenUrl = $publicUrl + '/screen/MT2026'
$hostUrl = $publicUrl + '/host/MT2026'

try { Set-Clipboard -Value $participantUrl } catch { }

Write-Host '3/3 실행 완료!' -ForegroundColor Green
Write-Host ''
Write-Host ('참가자: ' + $participantUrl)
Write-Host ('발표:   ' + $screenUrl)
Write-Host ('사회자: ' + $hostUrl)
Write-Host ''
Write-Host '참가자 주소를 클립보드에 복사했습니다.' -ForegroundColor Cyan
Write-Host '이 컴퓨터를 끄거나 MT_GAME_STOP.cmd를 실행하면 공개 주소가 종료됩니다.' -ForegroundColor Yellow

Start-Process $screenUrl
