import {createRouteParamDecorator} from '@nestjs/common'

export const ExistingUser = createRouteParamDecorator((data, req) => {
	return ({
		username: req.body.username, 
		password: req.body.password
	})
})