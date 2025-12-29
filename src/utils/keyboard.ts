import { user32 } from "./winapi";

const VK_CONTROL = 0x11;
const VK_V = 0x56;
const KEYEVENTF_KEYUP = 0x0002;

/**
 * Simulates a CTRL+V paste.
 * We wait for the user to release keys first to avoid conflicts.
 */
export async function simulatePaste() {
	// Wait for CTRL to be released by the user
	console.log("Waiting for user to release CTRL...");
	let timeout = 100; // max wait 1s
	while (timeout > 0) {
		// High bit is set if the key is down
		const state = user32.symbols.GetAsyncKeyState(VK_CONTROL);
		if (!(state & 0x8000)) break;
		await new Promise((r) => setTimeout(r, 10));
		timeout--;
	}

	// Extra safety buffer
	await new Promise((r) => setTimeout(r, 100));

	console.log("Simulating paste...");

	// Ensure CTRL is down
	user32.symbols.keybd_event(VK_CONTROL, 0, 0, 0);
	await new Promise((r) => setTimeout(r, 20));

	// Press and release V
	user32.symbols.keybd_event(VK_V, 0, 0, 0);
	await new Promise((r) => setTimeout(r, 20));
	user32.symbols.keybd_event(VK_V, 0, KEYEVENTF_KEYUP, 0);
	await new Promise((r) => setTimeout(r, 20));

	// Release CTRL
	user32.symbols.keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
}
