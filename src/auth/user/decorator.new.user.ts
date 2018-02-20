import {createRouteParamDecorator} from '@nestjs/common'

export const NewUser = createRouteParamDecorator((data, req) => {
	return ({
		username: req.body.username, 
		password: req.body.password, 
		email: req.body.email, 
		name: req.body.name
	})
})