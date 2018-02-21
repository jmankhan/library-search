/**
 * Parameters for the reviews.list endpoint
 */
export interface GoodreadsBookShelfParams {
	id :string 			//user_id
	key :string 		//developer key
	shelf? :string 		//name of the shelf that is being 
	sort? :string 		//sort by column
	search? :string 	//optional filter
	order? :string 		//a for ascending, d for descending
	page? :number 		//start paging bound
	per_page? :number 	//count per page
}