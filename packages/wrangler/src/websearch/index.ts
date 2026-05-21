import { createNamespace } from "../core/create-command";

export const webSearchNamespace = createNamespace({
	metadata: {
		description: "🔎 Run queries against Cloudflare Web Search",
		status: "open beta",
		owner: "Product: Web Search",
		category: "Compute & AI",
	},
});
