#Requires AutoHotkey v2.0
#SingleInstance Force
SetWorkingDir(A_ScriptDir) ; Ensure we are in the project root

; WIN+Ö - Paste prompt
#ö:: {
    Run('bun run paste', , 'Hide')
}

; WIN+Ü - Process job data  
#ü:: {
    Run('bun run process', , 'Hide')
}

; WIN+Esc - Reload Script
#Esc:: Reload()

; Show tray tip on startup
TrayTip("JobSeeker Hotkeys Active", "WIN+Ö: Paste`nWIN+Ü: Process`nWIN+Esc: Reload", 1)
