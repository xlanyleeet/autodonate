@echo off
echo 🎮 Автодонат для Minecraft - Інсталятор
echo ====================================
echo.

echo Крок 1: Перевірка Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не знайдено!
    echo Завантажте та встановіть Node.js з https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js знайдено
)

echo.
echo Крок 2: Встановлення залежностей
npm install
if %errorlevel% neq 0 (
    echo ❌ Помилка встановлення залежностей
    pause
    exit /b 1
) else (
    echo ✅ Залежності встановлено
)

echo.
echo Крок 3: Налаштування конфігурації
if not exist config.js (
    copy config.example.js config.js
    echo ✅ Створено config.js
    echo ⚠️  Відредагуйте config.js та встановіть правильні дані RCON
) else (
    echo ✅ config.js вже існує
)

echo.
echo Крок 4: Перевірка файлів
if exist autodonate.html (
    echo ✅ autodonate.html знайдено
) else (
    echo ❌ autodonate.html не знайдено
)

if exist css\autodonate.css (
    echo ✅ CSS файли знайдено
) else (
    echo ❌ CSS файли не знайдено
)

if exist js\autodonate.js (
    echo ✅ JavaScript файли знайдено
) else (
    echo ❌ JavaScript файли не знайдено
)

echo.
echo 🎉 Інсталяція завершена!
echo.
echo Наступні кроки:
echo 1. Відредагуйте config.js
echo 2. Налаштуйте RCON на Minecraft сервері
echo 3. Запустіть: npm start
echo 4. Відкрийте: http://localhost:3000
echo.

pause
