export interface BookParam {
	readonly keyword: string, 	//keyword to search. title, isbn, oclc work best
	page?: number, 				//start of paging bounds 
	isBook?: boolean
}

export function instanceOfBookParam(object :any) :object is BookParam {
	return 'isBook' in object
}