process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;
chai.use(chaiHttp)

describe("API BASE HOME", ()=> {
    it("GET HOME ENDPOINT", (done)=> {
        chai.request(server)
            .get('/api')
            .send()
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                done();
            })
    })

    it("CREATE ERROR ENDPOINT", (done)=> {
        chai.request(server)
            .get('/app')
            .send()
            .end((err, res) => {
                expect(res.status).to.be.equal(404)
                done()
            })
    })

    it("NO USER FOUND", (done)=> {
        chai.request(server)
            .get('/api/user/show')
            .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDkxYzNmNWJlMzUyZDVlODhlNDUzZDMiLCJyb2xlIjoiVXNlciIsImlhdCI6MTU3MDE2OTg5MywiZXhwIjoxNTcwMTczNDkzfQ.CVrGsqL7jy5bOWjUU3eVXnV_iAxO5GaHK1K10TjnwGA')
            .send()
            .end((err, res) => {
                expect(res.status).to.be.equal(403)
                done()
            })
    })
})
