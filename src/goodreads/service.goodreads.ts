import {Component} from '@nestjs/common'
import {GoodreadsAPI} from './api'
import {GoodreadsShelfParams, GoodreadsShelfResponse, 
		GoodreadsUserParams, GoodreadsUserResponse,
		GoodreadsBookShelfParams, GoodreadsBookShelfResponse} from './interfaces'

@Component()
export class GoodreadsService {
	private api :GoodreadsAPI

	constructor() {
		this.api = new GoodreadsAPI()
	}

	async getShelves(params :GoodreadsShelfParams) :Promise<GoodreadsShelfResponse> {
		return await this.api.getShelves(params)
	} 

	async getUser(params :GoodreadsUserParams) :Promise<GoodreadsUserResponse> {
		return await this.api.getUser(params)
	}

	async getBooksOnShelf(params :GoodreadsBookShelfParams) :Promise<GoodreadsBookShelfResponse> {
		return await this.api.getBooksOnShelf(params)
	}
}