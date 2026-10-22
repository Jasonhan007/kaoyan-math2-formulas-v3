@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 考研数学二公式大全 · 本地 AI 助手

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   [缺少 Node.js]
  echo   请先安装 Node.js（LTS 版）：https://nodejs.org/
  echo   装好后重新双击本文件即可。
  echo.
  pause
  exit /b 1
)

if not exist ".env" (
  copy /y ".env.example" ".env" >nul
  echo.
  echo   已为你创建 .env 文件。
  echo   请在打开的记事本里填这一行（等号后面粘你的密钥），然后 Ctrl+S 保存：
  echo.
  echo        DEEPSEEK_API_KEY=sk-你的密钥
  echo.
  start "" notepad ".env"
  echo   保存后回到本窗口，按任意键继续启动…
  pause >nul
)

echo.
echo   正在启动… 浏览器会自动打开（没打开就手动访问下面的地址）
echo   地址： http://127.0.0.1:8765/ai.html
echo   关闭本窗口即停止服务。
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 3; Start-Process 'http://127.0.0.1:8765/ai.html'"

node server\proxy.mjs
echo.
echo   服务已停止。
pause
