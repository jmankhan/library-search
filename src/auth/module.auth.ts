import * as passport from 'passport'
import {Module, NestModule, MiddlewaresConsumer, RequestMethod} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {AuthService} from './service.auth'
import {JwtStrategy} from './passport/strategy.jwt'
import {AuthController} from './controller.auth'
import {UserSchema} from './user/schema.user'
import {LoggerMiddleware} from '../middleware/middleware.logger'

@Module({
	imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
	controllers: [AuthController],
	components: [AuthService, JwtStrategy]
})

export class AuthModule implements NestModule {
	configure(consumer: MiddlewaresConsumer) {
		consumer.apply(passport.authenticate('jwt', {session: false}))
			.forRoutes({path: '/auth/token', method: RequestMethod.ALL})
	}
}