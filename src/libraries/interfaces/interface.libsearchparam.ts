export interface LibrarySearchParam {
	readonly book_oclc: string, 	//oclc number of book to search
	readonly zip: number, 			//zip code to search in
	readonly page: number,			//start paging bound
	isLibSearch: boolean
}

export function instanceOfLibrarySearchParam(object :any) :object is LibrarySearchParam {
	return 'book_oclc' in object
}