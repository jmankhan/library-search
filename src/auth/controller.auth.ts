import {Controller, Response, Request, Post, HttpStatus, HttpCode, HttpException, Get} from '@nestjs/common'
import {AuthService} from './service.auth'
import {NewUser} from './user/decorator.new.user'
import {ExistingUser} from './user/decorator.existing.user'
import {IUser} from './user/interface.user'
import {UserResponse} from './user/response.user'

@Controller('auth')
export class AuthController {
		constructor(private readonly authService: AuthService) {}

		@Post('register')
		@HttpCode(HttpStatus.OK)
		public async register(@Response() resp, @NewUser() user: IUser) {
			await this.authService.register(user)
		}

		@Post('login')
		public async login(@Response() resp, @ExistingUser() existing: IUser) {
			const user = await this.authService.login(existing)
			if(!user)
				throw new HttpException('User not found', 401)
			resp.send(user)
		}


		@Get('authorized')
		public async authorized() {
			console.log('authorized route')
		}

}