import { dlopen, FFIType } from "bun:ffi";

const user32 = dlopen("user32.dll", {
	RegisterHotKey: {
		args: [FFIType.ptr, FFIType.i32, FFIType.u32, FFIType.u32],
		returns: FFIType.i32,
	},
	UnregisterHotKey: {
		args: [FFIType.ptr, FFIType.i32],
		returns: FFIType.i32,
	},
	GetMessageW: {
		args: [FFIType.ptr, FFIType.ptr, FFIType.u32, FFIType.u32],
		returns: FFIType.i32,
		async: true,
	},
	TranslateMessage: {
		args: [FFIType.ptr],
		returns: FFIType.i32,
	},
	DispatchMessageW: {
		args: [FFIType.ptr],
		returns: FFIType.i32,
	},
	keybd_event: {
		args: [FFIType.u8, FFIType.u8, FFIType.u32, FFIType.u64],
		returns: FFIType.void,
	},
});

export { user32 };
