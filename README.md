# AI Music Prompt Builder

## 🚀 Overview

This is an advanced web application designed to help musicians, producers, and hobbyists craft the perfect prompts for AI music generation platforms. This tool streamlines the creative process by providing a structured interface and AI assistance to transform your musical ideas into a detailed and effective prompt.

The application is powered by the Google Gemini API and can generate lyrics, suggest musical styles, and even parse a simple text description to automatically configure your entire prompt.

---

## ✨ Features

*   **📝 Smart Lyric Input**: Manually type or paste lyrics, or use the **"Write Lyrics"** feature to generate them from a simple idea.
*   **🤖 AI-Powered Parsing**: Describe your desired song in plain language, and the app will automatically fill in the title, lyrics, styles, and other settings for you.
*   **🎨 Dynamic Style Tagging**: Add genres, moods, instruments, or any descriptive tags to define the sound.
*   **🧠 Intelligent Style Suggestions**: Get real-time style suggestions from Gemini based on the tags you've already added.
*   **🔧 Advanced Controls**: Fine-tune your creation with sliders for:
    *   **Vocal Gender**: From male to female.
    *   **Weirdness**: Control how experimental the output should be.
    *   **Style Influence**: Adjust how strongly the defined styles should affect the result.
*   **🎶 Instrumental Mode**: Easily toggle between vocal and instrumental tracks.
*   **🧼 Lyric Cleanup**: Automatically format lyrics, fix typos, and standardize tags like `[Verse]` and `[Chorus]` with a single click.
*   **📋 Final Prompt Generation**: Click **"Create"** to see a final, consolidated prompt in a convenient modal.
*   **💾 Workspace Management**: **Save** your current prompt configuration to your browser's local storage to continue later, or **Clear All** to start fresh.
*   **📚 Prompt Library**: Save and manage your favorite prompts in a personal library. Load them back into the editor with one click.

---

## 🛠️ How to Use

1.  **Quick Start**: Click the **"Write Lyrics"** button. Describe your song idea in the text box (e.g., "a sad lo-fi song about rain with female vocals"). Click "Parse and Apply" to have the AI fill out all the fields.
2.  **Manual Mode**:
    *   Enter or paste your text into the **Lyrics** field.
    *   Add descriptive tags like "80s synthwave," "energetic," or "acoustic guitar" in the **Styles** section.
    *   Use the sliders in **Advanced Options** to adjust vocal gender, weirdness, and style influence.
    *   Give your song a **Title**.
3.  **Refine**: Use the **"Format"** or **"Fix/Translate"** buttons to clean up your lyrics.
4.  **Generate**: Click the **"Create"** button at the bottom.
5.  **Copy & Paste**: A modal will appear with your final, formatted prompt. Click **"Copy to Clipboard"** and paste it into your favorite AI music generation tool.

---

## 💻 Tech Stack

*   **Frontend**: HTML5, CSS3, TypeScript
*   **Backend**: Node.js, Express
*   **AI**: Google Gemini API (`@google/genai`)

---

## 🚀 Getting Started: Running Locally

To run this application, you will need a Google Gemini API key.

1.  **Download the Project**
    *   In Google AI Studio, click the **"Download code"** button to download a ZIP file of the project.

2.  **Unzip the Archive**
    *   Locate the downloaded ZIP file (`project.zip`) and extract it to a convenient location on your computer.

3.  **Set Up the Backend**
    *   **Open a terminal**: Navigate into the extracted project folder. You can do this with the `cd path/to/your/project` command.
    *   **Install dependencies**: Run the command to install the necessary packages for the backend server:
        ```bash
        npm install
        ```
    *   **Create a `.env` file**: In the root folder of the project (the same place as `server.js` and `package.json`), create a new file named `.env`.
    *   **Add your API key**: Open the `.env` file in a text editor and add the following line, replacing `YOUR_API_KEY_HERE` with your actual Google Gemini API key:
        ```
        API_KEY=YOUR_API_KEY_HERE
        ```

4.  **Run the Server**
    *   In the same terminal, run the following command to start the local server:
        ```bash
        npm start
        ```
    *   You should see the message `Server listening at http://localhost:3000`. Keep this terminal window open while you use the application.

5.  **Open the App in a Browser**
    *   Find the `index.html` file in the project folder and open it in any modern web browser (e.g., Google Chrome, Firefox). The application will now be able to communicate with your local server.

<br>

---

<details>
<summary><strong>🇷🇺 Русская версия документации</strong></summary>

<br>

# Конструктор промптов для AI-генерации музыки

## 🚀 Обзор

Это продвинутое веб-приложение, разработанное для помощи музыкантам, продюсерам и любителям в создании идеальных промптов для платформ по генерации музыки с помощью искусственного интеллекта. Этот инструмент оптимизирует творческий процесс, предоставляя структурированный интерфейс и помощь AI для преобразования ваших музыкальных идей в подробный и эффективный промпт.

Приложение работает на базе Google Gemini API и может генерировать тексты песен, предлагать музыкальные стили и даже анализировать простое текстовое описание для автоматической настройки всего вашего промпта.

## ✨ Возможности

*   **📝 Умный ввод текста**: Вводите или вставляйте текст песни вручную, либо используйте функцию **"Написать текст"** для генерации из простой идеи.
*   **🤖 AI-анализ**: Опишите желаемую песню на простом языке, и приложение автоматически заполнит название, текст, стили и другие настройки за вас.
*   **🎨 Динамические теги стилей**: Добавляйте жанры, настроения, инструменты или любые описательные теги, чтобы определить звучание.
*   **🧠 Умные подсказки стилей**: Получайте от Gemini подсказки стилей в реальном времени на основе уже добавленных вами тегов.
*   **🔧 Расширенные настройки**: Точная настройка вашего творения с помощью ползунков:
    *   **Пол вокала**: От мужского до женского.
    *   **Странность (Weirdness)**: Контролируйте, насколько экспериментальным должен быть результат.
    *   **Влияние стиля**: Регулируйте, насколько сильно заданные стили должны влиять на результат.
*   **🎶 Инструментальный режим**: Легко переключайтесь между треками с вокалом и инструментальными.
*   **🧼 Очистка текста**: Автоматически форматируйте текст, исправляйте опечатки и стандартизируйте теги, такие как `[Куплет]` и `[Припев]`, одним кликом.
*   **📋 Генерация финального промпта**: Нажмите **"Создать"**, чтобы увидеть готовый, объединенный промпт в удобном модальном окне.
*   **💾 Управление рабочим пространством**: **Сохраняйте** текущую конфигурацию промпта в локальное хранилище браузера, чтобы продолжить позже, или **Очистить все**, чтобы начать заново.
*   **📚 Библиотека промптов**: Сохраняйте и управляйте вашими любимыми промптами. Загружайте их обратно в редактор одним кликом.

## 🛠️ Как использовать

1.  **Быстрый старт**: Нажмите кнопку **"Написать текст"**. Опишите идею вашей песни в текстовом поле (например, "грустная лоу-фай песня о дожде с женским вокалом"). Нажмите "Разобрать и применить", чтобы AI заполнил все поля.
2.  **Ручная настройка**:
    *   Введите или вставьте текст в поле **Текст песни**.
    *   Добавьте описательные теги, такие как "80s synthwave", "энергичный" или "акустическая гитара" в разделе **Стили**.
    *   Используйте ползунки в **Расширенных настройках** для настройки пола вокала, странности и влияния стиля.
    *   Дайте вашей песне **Название**.
3.  **Доработка**: Используйте кнопку **"Форматировать"** или **"Исправить/Перевести"** для очистки вашего текста.
4.  **Генерация**: Нажмите кнопку **"Создать"** внизу.
5.  **Копирование и вставка**: Появится модальное окно с вашим финальным, отформатированным промптом. Нажмите **"Копировать в буфер обмена"** и вставьте его в ваш любимый инструмент для генерации музыки с AI.

## 💻 Технологический стек

*   **Фронтенд**: HTML5, CSS3, TypeScript
*   **Бэкенд**: Node.js, Express
*   **AI**: Google Gemini API (`@google/genai`)

## 🚀 Запуск проекта локально

Для запуска этого приложения вам понадобится ключ Google Gemini API.

1.  **Скачайте проект**
    *   В Google AI Studio нажмите на кнопку **"Download code"** (Скачать код), чтобы загрузить ZIP-архив с проектом.

2.  **Распакуйте архив**
    *   Найдите скачанный ZIP-файл (`project.zip`) и распакуйте его в удобное для вас место на компьютере.

3.  **Настройте бэкенд**
    *   **Откройте терминал**: Перейдите в папку с распакованным проектом с помощью команды `cd путь/к/вашему/проекту`.
    *   **Установите зависимости**: Выполните команду для установки всех необходимых пакетов для бэкенд-сервера:
        ```bash
        npm install
        ```
    *   **Создайте файл `.env`**: В корневой папке проекта (там же, где находятся `server.js` и `package.json`) создайте файл с именем `.env`.
    *   **Добавьте API-ключ**: Откройте файл `.env` в текстовом редакторе и добавьте в него следующую строку, заменив `ВАШ_API_КЛЮЧ` вашим реальным ключом от Google Gemini API:
        ```
        API_KEY=ВАШ_API_КЛЮЧ
        ```

4.  **Запустите сервер**
    *   В том же терминале выполните команду для запуска локального сервера:
        ```bash
        npm start
        ```
    *   Вы должны увидеть сообщение `Server listening at http://localhost:3000`. Не закрывайте это окно терминала, пока работаете с приложением.

5.  **Откройте приложение в браузере**
    *   Найдите файл `index.html` в папке проекта и откройте его в любом современном веб-браузере (например, Google Chrome, Firefox). Приложение будет автоматически отправлять запросы на ваш локальный сервер.

</details>
