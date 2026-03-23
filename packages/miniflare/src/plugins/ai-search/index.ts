import { z } from "zod";
import {
	getUserBindingServiceName,
	Plugin,
	ProxyNodeBinding,
	remoteProxyClientWorker,
	RemoteProxyConnectionString,
} from "../shared";

const AISearchEntrySchema = z.object({
	namespace: z.string().optional(),
	instance_name: z.string().optional(),
	remoteProxyConnectionString: z
		.custom<RemoteProxyConnectionString>()
		.optional(),
});

export const AISearchOptionsSchema = z.object({
	aiSearchNamespaces: z.record(AISearchEntrySchema).optional(),
	aiSearchInstances: z.record(AISearchEntrySchema).optional(),
});

export const AI_SEARCH_PLUGIN_NAME = "ai-search";

export const AI_SEARCH_PLUGIN: Plugin<typeof AISearchOptionsSchema> = {
	options: AISearchOptionsSchema,
	async getBindings(options) {
		const bindings: {
			name: string;
			service: { name: string };
		}[] = [];

		for (const [bindingName, entry] of Object.entries(
			options.aiSearchNamespaces ?? {}
		)) {
			bindings.push({
				name: bindingName,
				service: {
					name: getUserBindingServiceName(
						AI_SEARCH_PLUGIN_NAME,
						bindingName,
						entry.remoteProxyConnectionString
					),
				},
			});
		}

		for (const [bindingName, entry] of Object.entries(
			options.aiSearchInstances ?? {}
		)) {
			bindings.push({
				name: bindingName,
				service: {
					name: getUserBindingServiceName(
						AI_SEARCH_PLUGIN_NAME,
						bindingName,
						entry.remoteProxyConnectionString
					),
				},
			});
		}

		return bindings;
	},
	getNodeBindings(options: z.infer<typeof AISearchOptionsSchema>) {
		const nodeBindings: Record<string, ProxyNodeBinding> = {};

		for (const bindingName of Object.keys(
			options.aiSearchNamespaces ?? {}
		)) {
			nodeBindings[bindingName] = new ProxyNodeBinding();
		}
		for (const bindingName of Object.keys(
			options.aiSearchInstances ?? {}
		)) {
			nodeBindings[bindingName] = new ProxyNodeBinding();
		}

		return nodeBindings;
	},
	async getServices({ options }) {
		const services: {
			name: string;
			worker: ReturnType<typeof remoteProxyClientWorker>;
		}[] = [];

		for (const [bindingName, entry] of Object.entries(
			options.aiSearchNamespaces ?? {}
		)) {
			services.push({
				name: getUserBindingServiceName(
					AI_SEARCH_PLUGIN_NAME,
					bindingName,
					entry.remoteProxyConnectionString
				),
				worker: remoteProxyClientWorker(
					entry.remoteProxyConnectionString,
					bindingName
				),
			});
		}

		for (const [bindingName, entry] of Object.entries(
			options.aiSearchInstances ?? {}
		)) {
			services.push({
				name: getUserBindingServiceName(
					AI_SEARCH_PLUGIN_NAME,
					bindingName,
					entry.remoteProxyConnectionString
				),
				worker: remoteProxyClientWorker(
					entry.remoteProxyConnectionString,
					bindingName
				),
			});
		}

		return services;
	},
};
