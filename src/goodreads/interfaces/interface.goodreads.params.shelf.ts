/**
 * Query string parameters needed to make request to Goodreads API.
 * These keys match the Goodreads API
 */
export class GoodreadsShelfParams {
	user_id: string 	//user id
	key?: string 		//developer key
	page?: number 		//start paging bound
	isShelf?: boolean
}

export function instanceOfGoodreadsShelf(object :any) :object is GoodreadsShelfParams {
	return 'isShelf' in object
}