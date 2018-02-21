/**
 * Query string parameters needed to make request to Goodreads API.
 * These keys match the Goodreads API
 */
export class GoodreadsShelfParams {
	id: string 			//user id
	key: string 		//developer key
	sort?: string 		//sort by column
	shelf?: string 		//shelf name. returns all if null
	page?: number 		//start paging bound
	per_page?: number 	//results per page. MAX OF 200
}