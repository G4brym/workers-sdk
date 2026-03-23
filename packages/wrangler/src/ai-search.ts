import { APIError } from "@cloudflare/workers-utils";
import { fetchResult } from "./cfetch";
import type { ComplianceConfig } from "@cloudflare/workers-utils";

export interface AISearchNamespace {
	name: string;
	created_at: string;
}

/**
 * Check if an AI Search namespace exists for the given account.
 * Returns the namespace info or null if not found (404).
 */
export async function getAISearchNamespace(
	complianceConfig: ComplianceConfig,
	accountId: string,
	namespaceName: string
): Promise<AISearchNamespace | null> {
	try {
		return await fetchResult<AISearchNamespace>(
			complianceConfig,
			`/accounts/${accountId}/ai-search/namespaces/${namespaceName}`,
			{ method: "GET" }
		);
	} catch (e) {
		if (e instanceof APIError && e.code === 7404) {
			return null;
		}
		throw e;
	}
}

/**
 * Create an AI Search namespace for the given account.
 * Used by the provisioning system (R2 bucket pattern) when a namespace
 * doesn't exist at deploy time.
 */
export async function createAISearchNamespace(
	complianceConfig: ComplianceConfig,
	accountId: string,
	namespaceName: string
): Promise<void> {
	await fetchResult<void>(
		complianceConfig,
		`/accounts/${accountId}/ai-search/namespaces`,
		{
			method: "POST",
			body: JSON.stringify({ name: namespaceName }),
		}
	);
}
