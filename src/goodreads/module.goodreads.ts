import * as passport from 'passport'
import {Module, MiddlewaresConsumer, RequestMethod} from '@nestjs/common'
import {GoodreadsController} from './controller.goodreads'
import {GoodreadsService} from './service.goodreads'

@Module({
	controllers: [GoodreadsController],
	components: [GoodreadsService]
})

export class GoodreadsModule {
	configure(consumer: MiddlewaresConsumer) {
		// consumer.apply(passport.authenticate('jwt', {session: false}))
		// 	.forRoutes({path: '/goodreads', method: RequestMethod.ALL})
	}
}