import { user32 } from "./winapi";

const VK_CONTROL = 0x11;
const VK_ALT = 0x12;
const VK_LWIN = 0x5b;
const VK_RWIN = 0x5c;
const VK_V = 0x56;
const VK_OEM_3 = 0xc0; // Ö
const VK_OEM_1 = 0xba; // Ü
const KEYEVENTF_KEYUP = 0x0002;

/**
 * Waits for specified keys to be released.
 */
async function waitForKeysReleased(keys: number[], maxWaitMs = 1500) {
	const start = Date.now();
	while (Date.now() - start < maxWaitMs) {
		const anyDown = keys.some(
			(vk) => (user32.symbols.GetAsyncKeyState(vk) & 0x8000) !== 0,
		);
		if (!anyDown) return;
		await new Promise((r) => setTimeout(r, 10));
	}
}

/**
 * Simulates CTRL+V paste after waiting for trigger keys to be released.
 */
export async function simulatePaste() {
	// Wait for all modifier keys and Ö/Ü to be released
	await waitForKeysReleased([
		VK_CONTROL,
		VK_ALT,
		VK_LWIN,
		VK_RWIN,
		VK_OEM_3,
		VK_OEM_1,
	]);
	await new Promise((r) => setTimeout(r, 200));

	// Simulate CTRL+V
	user32.symbols.keybd_event(VK_CONTROL, 0, 0, 0);
	await new Promise((r) => setTimeout(r, 30));
	user32.symbols.keybd_event(VK_V, 0, 0, 0);
	await new Promise((r) => setTimeout(r, 30));
	user32.symbols.keybd_event(VK_V, 0, KEYEVENTF_KEYUP, 0);
	await new Promise((r) => setTimeout(r, 30));
	user32.symbols.keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
	await new Promise((r) => setTimeout(r, 100));
}
