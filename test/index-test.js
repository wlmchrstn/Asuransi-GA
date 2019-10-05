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

})
