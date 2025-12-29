import { user32 } from "./winapi";

const VK_CONTROL = 0x11;
const VK_F1 = 0x70;
const VK_F2 = 0x71;
const VK_V = 0x56;
const KEYEVENTF_KEYUP = 0x0002;

/**
 * Simulates a CTRL+V paste.
 * We wait for the user to release keys first to avoid conflicts.
 */
export async function simulatePaste() {
	console.log("Waiting for user to release all trigger keys (CTRL, F1, F2)...");
	let timeout = 100; // max wait 1s
	const keysToWait = [VK_CONTROL, VK_F1, VK_F2];

	while (timeout > 0) {
		let anyKeyDown = false;
		for (const vk of keysToWait) {
			if (user32.symbols.GetAsyncKeyState(vk) & 0x8000) {
				anyKeyDown = true;
				break;
			}
		}
		if (!anyKeyDown) break;
		await new Promise((r) => setTimeout(r, 10));
		timeout--;
	}

	// Extra safety buffer
	await new Promise((r) => setTimeout(r, 100));

	console.log("Simulating paste (CTRL+V)...");
	// ... rest of the logic
	user32.symbols.keybd_event(VK_CONTROL, 0, 0, 0);
	await new Promise((r) => setTimeout(r, 20));
	user32.symbols.keybd_event(VK_V, 0, 0, 0);
	await new Promise((r) => setTimeout(r, 20));
	user32.symbols.keybd_event(VK_V, 0, KEYEVENTF_KEYUP, 0);
	await new Promise((r) => setTimeout(r, 20));
	user32.symbols.keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
}
