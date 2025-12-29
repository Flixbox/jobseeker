import { user32 } from "./utils/winapi";
import { getClipboardText, setClipboardText } from "./utils/clipboard";
import { simulatePaste } from "./utils/keyboard";
import { processJobData } from "./jobseeker";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { ptr } from "bun:ffi";
import { join } from "path";

const MOD_CONTROL = 0x0002;
const VK_F1 = 0x70;
const VK_F2 = 0x71;
const WM_HOTKEY = 0x0312;

const ID_CTRL_F1 = 1001;
const ID_CTRL_F2 = 1002;

// Resolve path relative to the script's directory for robustness
const PROMPT_FILE = join(import.meta.dir, "../assets/jobseeking_prompt.md");

async function runner() {
	try {
		console.log("🚀 JobSeeker Background Script Started");

		// Auto-cleanup existing instances using a PID file
		const pidFile = join(process.cwd(), ".jobseeker.pid.tmp");
		try {
			if (existsSync(pidFile)) {
				const oldPid = parseInt(readFileSync(pidFile, "utf-8").trim());
				if (oldPid && oldPid !== process.pid) {
					console.log(`Cleaning up old instance (PID: ${oldPid})...`);
					try {
						process.kill(oldPid, "SIGKILL");
					} catch {
						// PID might not exist anymore
					}
				}
			}
			writeFileSync(pidFile, process.pid.toString(), "utf-8");
		} catch {
			console.error("Warning: Could not handle PID file cleanup.");
		}

		console.log("Press CTRL+F1 to paste formatted prompt");
		console.log("Press CTRL+F2 to process job data from clipboard");
		console.log("Press CTRL+C in this terminal to exit");

		// Deregister any existing hotkeys with these IDs for this thread (best effort)
		user32.symbols.UnregisterHotKey(null, ID_CTRL_F1);
		user32.symbols.UnregisterHotKey(null, ID_CTRL_F2);

		// Register Hotkeys
		const ok1 = user32.symbols.RegisterHotKey(
			null,
			ID_CTRL_F1,
			MOD_CONTROL,
			VK_F1,
		);
		const ok2 = user32.symbols.RegisterHotKey(
			null,
			ID_CTRL_F2,
			MOD_CONTROL,
			VK_F2,
		);

		if (!ok1 || !ok2) {
			throw new Error(
				"Failed to register hotkeys. They are likely being used by another application.",
			);
		}

		console.log("✅ Hotkeys registered successfully.");

		process.on("SIGINT", () => {
			console.log("\nCleanup: Unregistering hotkeys...");
			user32.symbols.UnregisterHotKey(null, ID_CTRL_F1);
			user32.symbols.UnregisterHotKey(null, ID_CTRL_F2);
			process.exit(0);
		});

		// MSG structure buffer (48-64 bytes is enough)
		const msgBuffer = new Uint8Array(64);
		const msgPtr = ptr(msgBuffer);

		// Message Loop
		while (true) {
			// Clear buffer before each call
			msgBuffer.fill(0);

			// GetMessageW blocks until a message is available
			const res = await user32.symbols.GetMessageW(msgPtr, null, 0, 0);
			if (res < 0) {
				console.error("GetMessageW error:", res);
				break;
			}
			if (res === 0) {
				console.log("WM_QUIT received. Exiting...");
				break;
			}

			const view = new DataView(msgBuffer.buffer);
			const message = view.getUint32(8, true);

			if (message === WM_HOTKEY) {
				// wParam is at offset 16. For hotkeys, it's the 32-bit ID.
				const id = view.getUint32(16, true);
				// lParam is at offset 24. Modifiers (low word), VK (high word).
				const lParam = view.getBigUint64(24, true);
				const vk = Number((lParam >> 16n) & 0xffffn);

				console.log(`WM_HOTKEY: Received ID=${id}, VK=0x${vk.toString(16)}`);

				if (id === ID_CTRL_F1) {
					console.log("Matched ID_CTRL_F1 (1001)");
					await handleCtrlF1();
				} else if (id === ID_CTRL_F2) {
					console.log("Matched ID_CTRL_F2 (1002)");
					await handleCtrlF2();
				} else {
					console.log(`Unknown ID ${id}. Checking VK fallback...`);
					if (vk === VK_F1) {
						console.log("Matched VK_F1 (0x70) fallback");
						await handleCtrlF1();
					} else if (vk === VK_F2) {
						console.log("Matched VK_F2 (0x71) fallback");
						await handleCtrlF2();
					}
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
