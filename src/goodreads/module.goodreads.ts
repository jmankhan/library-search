import * as passport from 'passport'
import {Module, MiddlewaresConsumer, RequestMethod} from '@nestjs/common'
import {GoodreadsController} from './controller.goodreads'

@Module({
	controllers: [GoodreadsController]
})

export class GoodreadsModule {
	configure(consumer: MiddlewaresConsumer) {
		consumer.apply(passport.authenticate('jwt', {session: false}))
			.forRoutes({path: '/goodreads', method: RequestMethod.ALL})
	}
}