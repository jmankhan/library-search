export interface BookParam {
	readonly keyword: string, 	//keyword to search. title, isbn, oclc work best
	readonly page: number, 		//start of paging bounds 
	isBook?: boolean
}