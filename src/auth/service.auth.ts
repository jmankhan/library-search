import * as jwt from 'jsonwebtoken'
import {Component, Inject} from '@nestjs/common'
import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {UserSchema} from './user/schema.user' 
import {IUser} from './user/interface.user'

@Component()
export class AuthService {

	constructor(@InjectModel(UserSchema) private readonly userModel: Model<IUser>) {}

	async createToken(user: IUser) {
		const expiresIn = 3600
		const secret = 'q+m7kcMENkbhxQin9JCdvDOILQI4a7uOr0XcGpBfSnQ='
		const token = jwt.sign(user, secret, { expiresIn })
		return {
			expiresIn,
			token
		}
	}

	async register(user: IUser) {
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

	async login(user: IUser): Promise<boolean> {
		return this.userModel.findOne({username: user.username, password: user.password}, 'id name email', (err, found) => {
			return err ? err : found
		})
	}
}