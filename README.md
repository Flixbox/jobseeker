# 🚀 JobSeeker

JobSeeker is a productivity tool designed to streamline the job application process. It uses **AutoHotkey (v2)** for global hotkeys and **Bun/TypeScript** to process job descriptions into structured Markdown files for your Obsidian vault.

## ✨ Features

- **WIN+Ö**: Paste a job evaluation prompt into any window (AI-ready).
- **WIN+Ü**: Process job data from the clipboard and save it as a Markdown file.
- **WIN+Esc**: Quickly reload the hotkey script after changes.

---

## 🛠 Prerequisites

You need **AutoHotkey v2** and **Bun** installed on your Windows machine. You can install them using your favorite package manager.

### Choice 1: Scoop (Recommended)
```powershell
scoop install autohotkey-v2
scoop install bun
```

### Choice 2: Chocolatey
```powershell
choco install autohotkey.install
choco install bun
```

### Choice 3: Winget
```powershell
winget install AutoHotkey.AutoHotkey
winget install Oven-sh.Bun
```

---

## 🚀 Setup

1. **Clone & Install**
   ```bash
   bun install
   ```

2. **Configure Environment**
   Copy the example environment file and set your vault path:
   ```powershell
   copy .env.example .env
   ```
   Open `.env` and adjust `VAULT_PATH` to point to your target directory (e.g., your Obsidian vault folder).

3. **Start the Script**
   ```bash
   bun start
   ```
   This will launch the `hotkeys.ahk` script. You'll see an AutoHotkey icon in your system tray and a notification confirming it's active.

---

## 📂 Project Structure

- `hotkeys.ahk`: The global hotkey handler (AHK v2).
- `src/index.ts`: The CLI entry point called by AHK.
- `src/jobseeker.ts`: Logic for parsing JSON and generating Markdown.
- `assets/jobseeking_prompt.md`: The template used for evaluations.

## ⚙️ How it Works

1. **Paste Prompt (`WIN+Ö`)**:
   - Takes your current clipboard.
   - Wraps it in a detailed AI evaluation prompt.
   - Pastes it into the active window (e.g., ChatGPT/Claude).

2. **Process Job (`WIN+Ü`)**:
   - Expects the AI's JSON output in your clipboard.
   - Cleans the JSON and extracts company info.
   - Saves a formatted `.md` file to your `VAULT_PATH`.

---

## 🔧 Troubleshooting

- **Hotkeys not working?** Ensure `hotkeys.ahk` is running in the system tray. Use `WIN+Esc` to reload it.
- **Path Issues?** Double-check your `VAULT_PATH` in the `.env` file. Use absolute paths.
- **Bun Command?** Make sure Bun is in your system PATH.
