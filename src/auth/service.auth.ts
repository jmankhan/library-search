import * as jwt from 'jsonwebtoken'
import {Component, Inject, HttpCode} from '@nestjs/common'
import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {UserSchema} from './user/schema.user' 
import {IUser} from './user/interface.user'

import {DBException, UserNotFoundException} from '../exceptions'

@Component()
export class AuthService {

	constructor(@InjectModel(UserSchema) private readonly userModel: Model<IUser>) {}

	async createToken(user: IUser) {
		const secret = 'q+m7kcMENkbhxQin9JCdvDOILQI4a7uOr0XcGpBfSnQ='
		const token = jwt.sign(user, secret)
		return {
			token
		}
	}

	async register(user: IUser) {
		const record = new this.userModel(user)
		return await record.save(err => {
			if(err)
				throw new DBException()
		})
	}

	async login(user: IUser) :Promise<IUser> {
		return this.userModel.findOne({
				username: user.username,
				password: user.password
			}, 
			'id name email', 
			(err, doc) => {
				if(err)
					throw new UserNotFoundException()
				return doc
			}
		)
	}
}