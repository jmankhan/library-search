import {GoodreadsUser, GoodreadsShelfParams, GoodreadsBookShelfParams} from '../interfaces'

export class GoodreadsAPI {

	private baseUrl :string 	 = 'https://www.goodreads.com'
	private shelfUrl :string 	 = '/shelf/list.xml'
	private userUrl :string 	 = '/user/show/'
	private bookShelfUrl :string = '/review'

	private defaultShelfParams :GoodreadsShelfParams = {
		id : '',
		key : process.env.GOODREADS_KEY,
	}

	private defaultUserParams = {

	}

	private defaultBookShelfParams = {

	}

	private

	async getShelf(params :GoodreadsShelfParams) {	}
	async getUser(params :GoodreadsUser) { }
	async getBooksOnShelf(params :GoodreadsBookShelfParams) { }
}