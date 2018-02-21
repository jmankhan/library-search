/**
 * Library object model. Fields marked with '?' are optional as not all libraries
 * may have the information available
 */
export interface Library {
	readonly name: string
	readonly address?: string
	readonly phone?: string
	readonly catalog_url?: string
	readonly url?: string
	readonly lat?: number
	readonly lng?: number
}