import {Component} from '@nestjs/common'
import {GoodreadsShelfParams, GoodreadsShelfResponse} from './interfaces'
import {GoodreadsAPI} from './api'

@Component()
export class GoodreadsService {
	private api :GoodreadsAPI

	constructor() {
		this.api = new GoodreadsAPI()
	}

	async getShelves(params :GoodreadsShelfParams) :Promise<GoodreadsShelfResponse> {
		return this.api.getShelves(params)
	} 
}