/**
 * Parameters for the user.show endpoint
 */
export interface GoodreadsUserParams {
	id: string
	key: string
	isUser?: boolean
}

export function instanceOfGoodreadsUser(object :any) :object is GoodreadsUserParams {
	return 'isUser' in object
}