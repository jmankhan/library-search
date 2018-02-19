import * as passport from 'passport'
import {Module, NestModule, MiddlwaresConsumer, RequestMethod} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {AuthService} from './service.auth'
import {JwtStrategy} from './passport/strategy.jwt'
import {AuthController} from './controller.auth'
import {UserSchema} from './schema.user'
import { LoggerMiddleware } from '../middleware.logger'

@Module({
	imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
	controllers: [AuthController],
	components: [AuthService, JwtStrategy]
})

export class AuthModule implements NestModule {
	//protect all routes except for new token endpoint
	configure(consumer: MiddlwaresConsumer): void {
		consumer.apply(passport.authenticate('jwt', {session: false}))
			.forRoutes({path: '/auth/token', method: RequestMethod.ALL})
	}
}