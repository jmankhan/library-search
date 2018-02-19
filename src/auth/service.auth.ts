import * as jwt from 'jsonwebtoken'
import {Component, Inject} from '@nestjs/common'
import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {UserSchema} from './schema.user' 
import {IUser} from './interface.user'

@Component()
export class AuthService {

	constructor(@InjectModel(UserSchema) private readonly userModel: Model<IUser>) {}

	async createToken(user: IUser) {
		const expiresIn = 3600
		const secret = process.env.JWT_SECRET
		const token = jwt.sign(user, secret, { expiresIn })
		return {
			expiresIn,
			token
		}
	}

	async register(user: IUser) {
		console.log(`received user ${user.username}`)
		const record = new this.userModel(user)
		return await record.save(err => {
			if(err) {
				console.log(err)
				return '{status: 500}'
			}
			else {
				return '{status: 200}'
			}
		})
	}

	async validate(signedUser): Promise<boolean> {
		return true
	}
}