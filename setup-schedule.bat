@echo off
setlocal EnableDelayedExpansion

REM Check for Administrative privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :GotAdmin
) else (
    echo [INFO] Requesting administrative privileges...
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B
)

:GotAdmin
cd /d "%~dp0"
set "TASK_NAME=NadooBlogAutoPost"
set "SCRIPT_PATH=%~dp0"

echo [Nadoo AI] Setting up daily automation...
echo Working Directory: %SCRIPT_PATH%

:: Create Scheduled Task
:: Runs every day at 09:30 AM
schtasks /create /tn "%TASK_NAME%" /tr "\"%SCRIPT_PATH%run-daily-post.bat\"" /sc daily /st 09:30 /f

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Automation scheduled! 
    echo The blog post will run automatically every day at 9:30 AM.
    echo (Ensure your computer is turned on at that time)
    timeout /t 5 >nul
) else (
    echo.
    echo [ERROR] Failed to schedule task.
    pause
)
