@echo off
chcp 65001 > nul
echo ========================================================
echo   正在推送 佈告欄 (Bulletin Board) 至 GitHub...
echo ========================================================
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   [成功] 專案已成功推送至您的 GitHub！
    echo   https://github.com/grantchiang1983/bulletin-board
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [提醒] 若提示 Repository not found，請先至 GitHub 建立該 Repository:
    echo   👉 https://github.com/new?name=bulletin-board
    echo   建立完成後再次執行此腳本即可！
    echo ========================================================
)

pause
