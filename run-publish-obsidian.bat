
@echo off
cd /d "%~dp0"
echo [Obsidian] Syncing local markdown files to Blog...
node scripts/publish-obsidian.js
pause
