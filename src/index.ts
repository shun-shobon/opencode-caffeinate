import type { Plugin } from "@opencode-ai/plugin";

export const CaffeinatePlugin: Plugin = async ({ client }) => {
	const isMacOs = process.platform === "darwin";
	if (!isMacOs) {
		await client.tui.showToast({
			body: {
				title: "Caffeinate",
				message: "This plugin only supports macOS.",
				variant: "warning",
			},
		});
		return {};
	}

	let caffeinateProcess: Bun.Subprocess | null = null;

	const startCaffeinate = () => {
		if (caffeinateProcess) {
			return;
		}

		caffeinateProcess = Bun.spawn(["caffeinate", "-i"], {
			stdout: "ignore",
			stderr: "ignore",
		});
	};

	const stopCaffeinate = async () => {
		const process = caffeinateProcess;
		if (!process) {
			return;
		}

		caffeinateProcess = null;
		try {
			process.kill();
		} finally {
			await process.exited;
		}
	};

	return {
		event: async ({ event }) => {
			switch (event.type) {
				case "session.status": {
					const statusType = event.properties.status.type;
					switch (statusType) {
						case "busy":
						case "retry":
							startCaffeinate();
							break;
						case "idle":
							await stopCaffeinate();
							break;
					}
					break;
				}
				case "session.idle":
					await stopCaffeinate();
					break;
			}
		},
	};
};
