@echo off
chcp 65001 >nul
title AI@Sogang MT Round 3 - Start
pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-public.ps1"
echo.
pause
