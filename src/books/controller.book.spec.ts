import * as mocha from 'mocha'
import * as chai from 'chai'
import chaiHttp = require('chai-http')

import app from '../app.module'

chai.use(chaiHttp)
const expect = chai.expect

describe('GET /books', () => {

	it('should return a Book array', () => {
		return chai.request(app).get('/books')
			.then(res => {
				expect(res.status).to.equal(200)
				expect(res).to.be.json
				expect(res.body).to.be.an('array')
				expect(res.body).to.have.length(10)
			})
	})
})