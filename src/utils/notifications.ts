import notifier from "node-notifier";

export function notify(title: string, message: string) {
	notifier.notify({
		title: title,
		message: message,
		sound: true,
		wait: false,
	});
}

export function notifyError(title: string, message: string) {
	console.error(`❌ ${title}: ${message}`);
	notify(`❌ ${title}`, message);
}

export function notifySuccess(title: string, message: string) {
	console.log(`✅ ${title}: ${message}`);
	notify(`✅ ${title}`, message);
}
