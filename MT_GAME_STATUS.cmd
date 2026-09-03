@echo off
chcp 65001 >nul
title AI@Sogang MT Round 3 - Status
pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\status-public.ps1"
echo.
pause
