/**
 * Provider params required to search for a Library
 */
export interface LibParam {
	name: string, //name of library
	page: number, //start of paging bound
	isLib?: boolean
}