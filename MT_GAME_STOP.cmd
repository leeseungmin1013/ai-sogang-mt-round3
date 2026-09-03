@echo off
chcp 65001 >nul
title AI@Sogang MT Round 3 - Stop
pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-public.ps1"
echo.
pause
