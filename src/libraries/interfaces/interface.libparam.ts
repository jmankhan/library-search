/**
 * Provider params required to search for a Library
 */
export interface LibraryParam {
	name: string, //name of library
	page: number, //start of paging bound
	isLib?: boolean
}

export function instanceOfLibraryParam(object :any) :object is LibraryParam {
	return 'name' in object
}