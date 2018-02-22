import {BadRequestException, NotFoundException} from '@nestjs/common'
import {GoodreadsUserParams, instanceOfGoodreadsUser,
		GoodreadsShelfParams, instanceOfGoodreadsShelf, 
		GoodreadsBookShelfParams, instanceOfGoodreadsBookShelf,
		GoodreadsUserResponse, GoodreadsShelfResponse} from '../interfaces'
import {GoodreadsParser} from './parser.goodreads'
import {httpGet} from '../../http'

export class GoodreadsAPI {

	private baseUrl :string 	 = 'https://www.goodreads.com'
	private shelfUrl :string 	 = this.baseUrl + '/shelf/list.xml'
	private userUrl :string 	 = this.baseUrl + '/user/show'
	private bookShelfUrl :string = this.baseUrl + '/review/list'

	private readonly parser :GoodreadsParser = new GoodreadsParser()

	private defaultShelfParams :GoodreadsShelfParams = {
		user_id : '',
		key : process.env.GOODREADS_KEY,
		page: 1
	}

	private defaultUserParams :GoodreadsUserParams = {
		id : '',
		key : process.env.GOODREADS_KEY
	}

	private defaultBookShelfParams = {
		id : '', 							//user_id
		key : process.env.GOODREADS_KEY, 	//developer key
		v : 2,								//api version
		shelf :'to-read', 					//default to 'to read' shelf
		page : 1, 							//start paging bound
		per_page : 200 						//defaul to 200 for minimal paging
	}

	async getShelves(params :GoodreadsShelfParams) :Promise<GoodreadsShelfResponse> {
		params.isShelf = true

		return this.httpCallout(this.shelfUrl, params).then(res => {
			return this.parser.parseShelves(res.data)
		})
		.catch(err => {
			console.log(err)
			throw new NotFoundException('Error retriveing shelves')
		})
	}

	async getUser(params :GoodreadsUserParams) :Promise<GoodreadsUserResponse> {
		params.isUser = true

		return this.httpCallout(this.userUrl, params).then(res => {
			return this.parser.parseUser(res.data)
		})
		.catch(err => {
			console.log(err)
			throw new NotFoundException('Error retrieving user')
		})
	}

	async getBooksOnShelf(params :GoodreadsBookShelfParams) { 
		params.isBookShelf = true

		return this.httpCallout(this.bookShelfUrl, params).then(res => {
			return this.parser.parseBooksOnShelf(res.data)
		})
		.catch(err => {
			console.log(err)
			throw new NotFoundException('Error retrieving Shelves for this user')
		})
	}

	private httpCallout(url :string, typedParams :GoodreadsShelfParams|GoodreadsUserParams|GoodreadsBookShelfParams) :Promise<any> {
		let params = {}
		if(instanceOfGoodreadsShelf(typedParams)) {
			Object.assign(params, this.defaultShelfParams)
			params['user_id'] = typedParams.user_id
		}
		else if(instanceOfGoodreadsUser(typedParams)) {
			Object.assign(params, this.defaultUserParams)
			params['id'] = typedParams.id
		}
		else if(instanceOfGoodreadsBookShelf(typedParams)) {
			Object.assign(params, this.defaultBookShelfParams)
			let p = typedParams as GoodreadsBookShelfParams
			params['id'] = p.id
			if(p.page)
				params['page'] = p.page
			if(p.per_page)
				params['per_page'] = p.per_page
			if(p.shelf)
				params['shelf'] = p.shelf
			if(p.sort)
				params['sort'] = p.sort
			if(p.order)
				params['order'] = p.order
		}
		else {
			throw new BadRequestException('Invalid parameters for goodreads')
		}

		return httpGet(url, params)
	}
}