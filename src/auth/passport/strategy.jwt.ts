import * as passport from 'passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {Component, Inject, HttpException} from  '@nestjs/common'
import {AuthService} from '../service.auth'

@Component()
export class JwtStrategy extends Strategy {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true,
			secretOrKey: 'q+m7kcMENkbhxQin9JCdvDOILQI4a7uOr0XcGpBfSnQ='
		}, 
		async (req, payload, next) => {
			await this.verify(req, payload, next)
		})

		passport.use(this)
	}

	public async verify(req, payload, done) {
		const isValid = await this.authService.login(payload)
		if(!isValid)
			return done(new HttpException('Forbidden', 401), false)
		else	
			done(null, payload)
	}
}