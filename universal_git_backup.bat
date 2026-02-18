@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================================
echo       📂 만능 깃허브 백업 도우미 (Universal Git Setup)
echo ========================================================
echo.
echo  이 스크립트는 현재 폴더("%CD%")를
echo  깃허브 저장소로 만들어줍니다.
echo.

:: 1. Git 설치 확인
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Git이 설치되지 않았습니다. https://git-scm.com/ 에서 설치해주세요.
    pause
    exit /b
)

:: 2. 저장소 초기화
if not exist ".git" (
    echo [1/4] 깃 저장소를 초기화합니다...
    git init
) else (
    echo [알림] 이미 깃 저장소가 존재합니다. 업데이트를 진행합니다.
)

:: 3. .gitignore 자동 생성 (없을 경우)
if not exist ".gitignore" (
    echo [2/4] .gitignore 파일이 없어서 자동으로 만듭니다...
    (
        echo .DS_Store
        echo Thumbs.db
        echo .vscode/
        echo .idea/
        echo __pycache__/
        echo node_modules/
        echo *.log
        echo *.mp4
        echo *.mov
        echo debug_uploads/
    ) > .gitignore
)

:: 4. 파일 추가 및 커밋
echo [3/4] 모든 파일을 담는 중...
git add .
git commit -m "Auto-backup by Universal Script" >nul 2>&1

:: 5. 깃허브 연결 확인 및 연결
echo.
echo ========================================================
echo  [중요] 깃허브에 만든 '저장소 주소'가 필요합니다.
echo  예: https://github.com/nadooai/my-project.git
echo ========================================================
echo.

:ASK_URL
:: 기존 리모트 확인
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo [알림] 이미 깃허브와 연결되어 있습니다.
    git remote get-url origin
    echo.
    set /p "RECONNECT=연결된 주소를 바꾸시겠습니까? (y/n): "
    if /i "!RECONNECT!"=="y" (
        set /p "REPO_URL=새로운 깃허브 주소를 붙여넣으세요: "
        git remote set-url origin !REPO_URL!
    )
) else (
    set /p "REPO_URL=깃허브 주소를 붙여넣으세요 (우클릭): "
    git remote add origin !REPO_URL!
)

:: 6. 업로드 (Push)
echo.
echo [4/4] 깃허브로 업로드 중... (잠시만 기다리세요)
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 성공적으로 백업되었습니다!
) else (
    echo.
    echo ❌ 업로드 실패! 주소가 정확한지, 인터넷이 연결되었는지 확인하세요.
)

echo.
pause
