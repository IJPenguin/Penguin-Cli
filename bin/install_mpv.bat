@echo off
cls

:: Check if Chocolatey is installed
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Chocolatey...
    @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    if %errorlevel% equ 0 (
        echo Chocolatey installed successfully.
    ) else (
        echo Error: Failed to install Chocolatey. Exiting.
        exit /b 1
    )
) else (
    echo Chocolatey is already installed.
)

:: Install MPV player using Chocolatey

mpv --h > nul 2>&1
if %errorlevel% equ 0 (
    echo MPV player is already installed.
) else (
    echo MPV player is not installed. Installing now...
    choco install mpv -y
    if %errorlevel% equ 0 (
        echo MPV player installed successfully.
    ) else (
        echo Error: Failed to install MPV player.
        exit /b 1
    )
)


pause
