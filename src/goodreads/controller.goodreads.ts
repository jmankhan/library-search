import {Controller, Get} from '@nestjs/common'

@Controller('goodreads')
export class GoodreadsController {
	constructor() {}

	@Get()
	public async test() {
		return '{status: 200}'
	}
}