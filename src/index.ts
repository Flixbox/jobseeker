import { user32 } from "./utils/winapi";
import { getClipboardText, setClipboardText } from "./utils/clipboard";
import { simulatePaste } from "./utils/keyboard";
import { processJobData } from "./jobseeker";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { ptr } from "bun:ffi";
import { join } from "path";

const MOD_CONTROL = 0x0002;
const MOD_NOREPEAT = 0x4000;
const VK_F1 = 0x70;
const VK_F2 = 0x71;
const WM_HOTKEY = 0x0312;

const ID_F1 = 1;
const ID_F2 = 2;

// Resolve path relative to the script's directory for robustness
const PROMPT_FILE = join(import.meta.dir, "../assets/jobseeking_prompt.md");

async function runner() {
	try {
		console.log("🚀 JobSeeker Background Script Started");

		// Auto-cleanup existing instances
		const pidFile = join(process.cwd(), ".jobseeker.pid.tmp");
		try {
			if (existsSync(pidFile)) {
				const oldPid = parseInt(readFileSync(pidFile, "utf-8").trim());
				if (oldPid && oldPid !== process.pid) {
					console.log(`Cleaning up old instance (PID: ${oldPid})...`);
					try {
						// Use taskkill if possible for cleaner cleanup on Windows
						process.kill(oldPid, "SIGKILL");
					} catch {}
				}
			}
			writeFileSync(pidFile, process.pid.toString(), "utf-8");
		} catch {}

		console.log("Press CTRL+F1 to paste formatted prompt");
		console.log("Press CTRL+F2 to process job data from clipboard");

		// Unregister potential old ones
		user32.symbols.UnregisterHotKey(null, ID_F1);
		user32.symbols.UnregisterHotKey(null, ID_F2);

		// Register Hotkeys with NOREPEAT
		const ok1 = user32.symbols.RegisterHotKey(
			null,
			ID_F1,
			MOD_CONTROL | MOD_NOREPEAT,
			VK_F1,
		);
		const ok2 = user32.symbols.RegisterHotKey(
			null,
			ID_F2,
			MOD_CONTROL | MOD_NOREPEAT,
			VK_F2,
		);

		if (!ok1 || !ok2) {
			console.error(
				`Hotkeys failed: F1=${ok1}, F2=${ok2}. Check if another app uses them!`,
			);
			process.exit(1);
		}

		console.log("✅ Hotkeys registered successfully.");

		process.on("SIGINT", () => {
			console.log("\nCleanup: Unregistering hotkeys...");
			user32.symbols.UnregisterHotKey(null, ID_F1);
			user32.symbols.UnregisterHotKey(null, ID_F2);
			process.exit(0);
		});

		const msgBuffer = new Uint8Array(64);
		const msgPtr = ptr(msgBuffer);

		// Message Loop
		while (true) {
			// GetMessageW blocks until a message is available
			const res = await user32.symbols.GetMessageW(msgPtr, null, 0, 0);
			if (res <= 0) break;

			const view = new DataView(msgBuffer.buffer);
			const message = view.getUint32(8, true);

			if (message === WM_HOTKEY) {
				// Read wParam as 32-bit (offset 16) or 64-bit (offset 16)
				const rawW = view.getBigUint64(16, true);
				const id = Number(rawW & 0xffffffffn);
				const rawL = view.getBigUint64(24, true);
				const vk = Number((rawL >> 16n) & 0xffffn);

				console.log(
					`[${new Date().toLocaleTimeString()}] WM_HOTKEY: ID=${id}, VK=0x${vk.toString(16)}`,
				);

				if (id === ID_F1 || vk === VK_F1) {
					console.log(">>> Executing CTRL+F1 logic");
					await handleCtrlF1();
				} else if (id === ID_F2 || vk === VK_F2) {
					console.log(">>> Executing CTRL+F2 logic");
					await handleCtrlF2();
				}
			}

			user32.symbols.TranslateMessage(msgPtr);
			user32.symbols.DispatchMessageW(msgPtr);
		}
	} catch (err: unknown) {
		console.error("FATAL ERROR in runner:");
		if (err instanceof Error) {
			console.error(err.message);
			console.error(err.stack);
		} else {
			console.error(err);
		}
		process.exit(1);
	}
}

async function handleCtrlF1() {
	console.log("Hotkey: CTRL+F1 triggered");
	try {
		if (!existsSync(PROMPT_FILE)) {
			console.error(`Missing ${PROMPT_FILE}`);
			return;
		}

		const clipboardContent = getClipboardText();
		let prompt = readFileSync(PROMPT_FILE, "utf-8");
		prompt = prompt.replace("<<clipboard>>", clipboardContent);

		console.log(`Setting clipboard to prompt (${prompt.length} chars)...`);
		setClipboardText(prompt);

		// Beep so user knows it's doing something
		user32.symbols.MessageBeep(0);

		// Brief delay to let clipboard settle
		await new Promise((r) => setTimeout(r, 150));

		await simulatePaste();
		console.log("✅ Prompt pasted.");
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Error in CTRL+F1:", err.message);
		}
	}
}

async function handleCtrlF2() {
	console.log("Hotkey: CTRL+F2 triggered");
	try {
		const clipboardContent = getClipboardText();
		console.log("Processing clipboard content...");
		const success = processJobData(clipboardContent);
		if (success) {
			console.log("✅ Job data processed and saved.");
		} else {
			console.log("❌ Job data processing failed.");
		}
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Error in CTRL+F2:", err.message);
		}
	}
}

runner();
