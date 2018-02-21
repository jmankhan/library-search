import {GoodreadsUser, instanceOfGoodreadsUser,
		GoodreadsShelfParams, instanceOfGoodreadsShelf, 
		GoodreadsBookShelfParams, instanceOfGoodreadsBookShelf,
		GoodreadsShelfResponse} from '../interfaces'
import {GoodreadsParser} from './parser.goodreads'
import {httpGet} from '../../http'

export class GoodreadsAPI {

	private baseUrl :string 	 = 'https://www.goodreads.com'
	private shelfUrl :string 	 = this.baseUrl + '/shelf/list.xml'
	private userUrl :string 	 = this.baseUrl + '/user/show/'
	private bookShelfUrl :string = this.baseUrl + '/review'

	private readonly parser :GoodreadsParser = new GoodreadsParser()

	private defaultShelfParams :GoodreadsShelfParams = {
		id : '',
		key : process.env.GOODREADS_KEY,
		page: 1
	}

	private defaultUserParams = {

	}

	private defaultBookShelfParams = {

	}

	async getShelves(params :GoodreadsShelfParams) :Promise<GoodreadShelfResponse> {
		params.isShelf = true

		return this.httpCallout(this.shelfUrl, params).then(res => {
			return this.parser.parseShelves(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

	async getUser(params :GoodreadsUser) { }
	async getBooksOnShelf(params :GoodreadsBookShelfParams) { }

	private httpCallout(url :string, typedParams :GoodreadsShelfParams|GoodreadsUserParams|GoodreadsBookShelfParams) :Promise<any> {
		let params = {}
		if(instanceOfGoodreadsShelf(typedParams)) {
			Object.assign(params, this.defaultShelfParams)
			params['user_id'] = typedParams.user_id
		}

		return httpGet(url, params)
	}
}