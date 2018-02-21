import {HttpException, HttpStatus} from '@nestjs/common'

export class DBException extends HttpException {
	constructor() {
		super('There was an error connecting to the database', HttpStatus.REQUEST_TIMEOUT)
	}
}