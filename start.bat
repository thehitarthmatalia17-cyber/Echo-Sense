@echo off
TITLE ECHO SENSE - AI Hearing Screening System
echo ===================================================================
echo   ECHO SENSE - AI-Powered Early Hearing Difficulty Screening System
echo   Tagline: Listen Beyond the Silence.
echo ===================================================================
echo.

set SCRIPT_DIR=%~dp0
set TOOLS_DIR=%SCRIPT_DIR%..\tools
set NODE_EXE=%TOOLS_DIR%\node\node.exe
set NPM_CMD=%TOOLS_DIR%\node\npm.cmd
set PYTHON_EXE=%TOOLS_DIR%\python\python.exe

echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000...
start "ECHO SENSE Backend" cmd /k "cd /d %SCRIPT_DIR%backend && %PYTHON_EXE% -u run.py"

echo.
echo [2/2] Starting React Vite Frontend on http://localhost:3000...
set PATH=%TOOLS_DIR%\node;%PATH%
start "ECHO SENSE Frontend" cmd /k "cd /d %SCRIPT_DIR%frontend && %NPM_CMD% run preview -- --port 3000 --host"

echo.
echo ===================================================================
echo   ECHO SENSE is running!
echo   Frontend Website: http://localhost:3000
echo   Backend API:      http://127.0.0.1:8000
echo   API Swagger Docs: http://127.0.0.1:8000/docs
echo ===================================================================
pause
