import * as passport from 'passport'
import {Module, RequestMethod} from '@nestjs/common'
import {GoodreadsController} from './controller.goodreads'

@Module({
	controllers: [GoodreadsController]
})

export class GoodreadsModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(passport.authenticate('jwt', {session: false}))
			.forRoutes({path: '/goodreads', method: RequestMethod.ALL})
	}
}