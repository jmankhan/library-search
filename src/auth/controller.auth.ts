import {Controller, Response, Request, Post, HttpStatus, HttpCode, HttpException, Get} from '@nestjs/common'
import {AuthService} from './service.auth'
import {NewUser} from './decorator.user'
import {IUser} from './interface.user'

@Controller('auth')
export class AuthController {
		constructor(private readonly authService: AuthService) {}

		@Post('register')
		public async register(@Response() resp, @NewUser() user: IUser) {
			console.log(user)
			await this.authService.register(user)
			resp.sendStatus(HttpStatus.OK)
		}


		@Get('authorized')
		public async authorized() {
			console.log('authorized route')
		}

}