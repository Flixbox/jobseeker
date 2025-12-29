import { user32 } from "./utils/winapi";
import { getClipboardText, setClipboardText } from "./utils/clipboard";
import { simulatePaste } from "./utils/keyboard";
import { processJobData } from "./jobseeker";
import { readFileSync, existsSync } from "fs";
import { ptr } from "bun:ffi";
import { join } from "path";

const MOD_CONTROL = 0x0002;
const VK_F1 = 0x70;
const VK_F2 = 0x71;
const WM_HOTKEY = 0x0312;

const ID_CTRL_F1 = 1;
const ID_CTRL_F2 = 2;

// Resolve path relative to the script's directory for robustness
const PROMPT_FILE = join(import.meta.dir, "../assets/jobseeking_prompt.md");

async function runner() {
	console.log("🚀 JobSeeker Background Script Started");
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
		console.error("❌ Failed to register hotkeys.");
		console.error(
			"Reason: Hotkeys are likely being used by another application (or a hanging instance of this script).",
		);
		console.log("Try closing other instances or changing the hotkeys.");
		process.exit(1);
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
		// GetMessageW blocks until a message is available
		const res = await user32.symbols.GetMessageW(msgPtr, null, 0, 0);
		if (res <= 0) break;

		const view = new DataView(msgBuffer.buffer);
		const message = view.getUint32(8, true);

		if (message === WM_HOTKEY) {
			const id = Number(view.getBigUint64(16, true));

			if (id === ID_CTRL_F1) {
				await handleCtrlF1();
			} else if (id === ID_CTRL_F2) {
				handleCtrlF2();
			}
		}

		user32.symbols.TranslateMessage(msgPtr);
		user32.symbols.DispatchMessageW(msgPtr);
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

		setClipboardText(prompt);

		// Brief delay to let clipboard settle
		await new Promise((r) => setTimeout(r, 100));

		simulatePaste();
		console.log("✅ Prompt pasted.");
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Error in CTRL+F1:", err.message);
		}
	}
}

function handleCtrlF2() {
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
