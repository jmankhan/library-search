import {Controller, Get, Body, Query} from '@nestjs/common'
import {LibraryService} from './service.library'
import {Library} from './interface.library'

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
	async findByName(@Query() params: string): Promise<Library[]> {
		return await this.service.findByName(params)
	}
}