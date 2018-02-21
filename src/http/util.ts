/*
	Performs a GET request without encoding the url query string parameters, which axios
	does by default
 */
const axios = require('axios')

export function httpGet(url :string, params :any) :Promise<any> {
	return axios.get(url, {
		paramsSerializer: function(params) {
			return '?' + Object.keys(params).map(key => {
				return key + '=' + (params[key] ? params[key] : '')
			}).join('&').replace(' ', '')
		},
		params: params
	})
}