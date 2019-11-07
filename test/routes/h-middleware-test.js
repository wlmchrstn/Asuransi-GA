process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;
const User = require('../../models/user')
chai.use(chaiHttp);

describe("MIDDLEWARE OPERATION", ()=> {

    before(done=> {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: "client",
                password: "123456"
            })
            .end((err, res)=> {
                token = res.header.authorization
                expect(token).to.be.a('string')
                User.deleteOne({username: "client"})
                    .then(
                        done()
                    )
            })
    })

    it("NOT SUPER ADMIN", (done)=> {
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', token)
            .end((err,res)=>{
                expect(res.status).to.be.equal(403)
                done()
            })
    })

    it("NOT ADMIN", (done)=> {
        chai.request(server)
            .post('/api/insurance/create')
            .set('Authorization', token)
            .end((err,res)=>{
                expect(res.status).to.be.equal(403)
                done()
            })
    })

    it("NO TOKEN PROVIDED", (done)=> {
        chai.request(server)
            .post('/api/user/admin')
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(401)
                done()
            })
    })

    it("NO USER FOUND", (done)=> {
        chai.request(server)
            .put('/api/user/update')
            .send()
            .set('Authorization', token)
            .end((err, res)=> {
                expect(res.status).to.be.equal(403)
                done()
            })
    })
})