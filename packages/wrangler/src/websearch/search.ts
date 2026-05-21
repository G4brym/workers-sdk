import { createCommand } from "../core/create-command";
import { logger } from "../logger";
import { search } from "./client";

export const webSearchSearchCommand = createCommand({
	metadata: {
		description: "Run a query against Cloudflare Web Search",
		status: "open beta",
		owner: "Product: Web Search",
	},
	behaviour: {
		printBanner: (args) => !args.json,
	},
	args: {
		query: {
			type: "string",
			demandOption: true,
			description: "The search query text.",
		},
		limit: {
			type: "number",
			description:
				"Maximum number of results to return (defaults to 10, capped at 20).",
		},
		json: {
			type: "boolean",
			default: false,
			description: "Return output as clean JSON",
		},
	},
	positionalArgs: ["query"],
	async handler(args, { config }) {
		const body: { query: string; limit?: number } = { query: args.query };
		if (args.limit !== undefined) {
			body.limit = args.limit;
		}

		const result = await search(config, body);

		if (args.json) {
			logger.log(JSON.stringify(result, null, 2));
			return;
		}

		logger.log(
			`Search query: "${result.metadata.query}"  (${result.items.length} results, ${result.metadata.latencyMs}ms, request ${result.metadata.requestId})\n`
		);

		if (result.items.length === 0) {
			logger.log("No results found.");
			return;
		}

		logger.table(
			result.items.map((item, i) => ({
				"#": String(i + 1),
				title:
					item.title.length > 60 ? item.title.slice(0, 60) + "..." : item.title,
				url: item.url.length > 80 ? item.url.slice(0, 80) + "..." : item.url,
				description: item.description
					? item.description.length > 80
						? item.description.slice(0, 80) + "..."
						: item.description
					: "",
				lastModified: item.lastModifiedDate ?? "",
			}))
		);
	},
});
