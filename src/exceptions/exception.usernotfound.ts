import {HttpException, HttpStatus} from '@nestjs/common'

export class UserNotFoundException extends HttpException {
	constructor() {
		super('Incorrect username or password', HttpStatus.NOT_FOUND)
	}
}