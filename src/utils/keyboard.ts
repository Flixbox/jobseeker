import { user32 } from "./winapi";

const VK_CONTROL = 0x11;
const VK_V = 0x56;
const KEYEVENTF_KEYUP = 0x0002;

export function simulatePaste() {
	// Press Ctrl
	user32.symbols.keybd_event(VK_CONTROL, 0, 0, 0);
	// Press V
	user32.symbols.keybd_event(VK_V, 0, 0, 0);
	// Release V
	user32.symbols.keybd_event(VK_V, 0, KEYEVENTF_KEYUP, 0);
	// Release Ctrl
	user32.symbols.keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
}
