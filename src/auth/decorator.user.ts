import {createRouteParamDecorator} from '@nestjs/common'

export const NewUser = createRouteParamDecorator((data, req) => {
	console.log(req.user)
	return ({
		username: req.body.username, 
		password: req.body.password, 
		email: req.body.email, 
		name: req.body.name
	})
})