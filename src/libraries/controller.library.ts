import {Controller, Get, Body, Query} from '@nestjs/common'
import {LibraryService} from './service.library'
import {Library} from './interface.library'
import {LibParam} from '../worldcat/interface.libparam'
import {LibrarySearchParam} from '../worldcat/interface.libsearchparam'

/**
 * Library controller that handles the endpoint
 * @param {[type]} 'library' endpoint name
 */
@Controller('library')
export class LibraryController {
	constructor(private readonly service: LibraryService) {}
	
	/**
	 * Uses the Library service to find a list of Library.
	 * @param  {params}             params Query string params
	 * @return {Promise<Library[]>}        Returns a Promise from the service that may be rejected
	 */
	@Get()
	async find(@Query() params: LibParam|LibrarySearchParam): Promise<Library[]> {
		if(params.name)
			return await this.service.findByName(params)
		else if(params.book_oclc)
			return await this.service.findByBook(params)
		else
			return []
	}

}