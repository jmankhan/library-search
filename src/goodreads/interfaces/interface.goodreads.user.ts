/**
 * Parameters for the user.show endpoint
 */
export interface GoodreadsUser {
	user_id: string
	isUser: boolean
}

export function instanceOfGoodreadsUser(object :any) :object is GoodreadsUser {
	return 'isUser' in object
}