/**
 * Book object model that ensures fields are created with required and optional fields
 */
export interface Book {
	readonly title: string
	readonly author: string
	readonly oclc: string
	readonly isbn?: string
	readonly publisher?: string
	readonly publishDate?: Date
	readonly publishCity?: string
	readonly isBook?: boolean
}