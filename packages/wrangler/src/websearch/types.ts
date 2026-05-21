/**
 * A single Web Search result.
 *
 * Web Search is discovery-only -- results carry catalog metadata about a page
 * but never the page body. To read a result's content, fetch the URL yourself.
 */
export interface WebSearchResult {
	/** Canonical URL. */
	url: string;
	/** Page title. */
	title: string;
	/** Page-level description. May be absent. */
	description?: string;
	/**
	 * Last-modified date for the page, when known. Naive (no timezone)
	 * ISO-8601 datetime, e.g. "2025-11-30T04:39:48".
	 */
	lastModifiedDate?: string;
	/** Page meta image URL (typically og:image). May be absent. */
	imageUrl?: string;
	/** Optional favicon URL for UI hints. */
	faviconUrl?: string;
}

/**
 * Per-response metadata for a Web Search query. Carries operational fields
 * useful for support and debugging.
 */
export interface WebSearchResponseMetadata {
	/** The query that was executed. */
	query: string;
	/** Opaque request identifier used for support and debugging. */
	requestId: string;
	/** End-to-end latency for this search request, in milliseconds. */
	latencyMs: number;
}

/**
 * Response from a Web Search query.
 */
export interface WebSearchSearchResponse {
	items: WebSearchResult[];
	metadata: WebSearchResponseMetadata;
}
