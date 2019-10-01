process.env.NODE_ENV = 'test'

const User = require('../../models/user')
const funcHelper = require('../../helpers/funcHelper')

const server = require('../../app')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect()
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken');

chai.use(chaiHttp)

describe ('USER CONTROLLER',()=>{

    before((done)=>{
        User.deleteMany({}, (err)=>{
            done()
        })
    })

    var testAdmin  =  {name   : 'admin',
                      username: 'admin',
                      email   : 'admin@gmail.com',
                      password: '12345'}

    var testClient =  {name   : 'client',
                      username: 'client',
                      email   : 'client@gmail.com',
                      password: '12345'}
    
    it("POST /api/user/super should create super admin", done=>{
        chai.request(server)
            .post('/api/user/super')
            .end((err,res)=>{
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/super should not create super admin", done=>{
        chai.request(server)
            .post('/api/user/super')
            .end((err,res)=>{
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal("You can only create super admin once")
                done()
            })
    })

    it("POST /api/user/login should not login", done=>{
        chai.request(server)
            .post('/api/user/login')
            .send({username: 'super_admin', password: '123456'})
            .end((err,res)=>{
                res.should.have.status(422)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Failed to login!')
                done()
            })
    })

    it("POST /api/user/login should login", done=>{
        chai.request(server)
            .post('/api/user/login')
            .send({login: 'super_admin', password: '12345'})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Token created! Access given!')
                res.body.should.have.property('result')
                res.body.should.have.property('id')
                res.body.should.have.property('role')
                tokenLogin = res.body.result
                done()
            })
    })

    it("POST /api/user/admin should not create admin", done=>{
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', `${tokenLogin}`)
            .end((err,res)=>{
                res.should.have.status(422)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Failed to create admin!')
                done()
            })
    })

    it("POST /api/user/admin should create super admin", done=>{
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', `${tokenLogin}`)
            .send(testAdmin)
            .end((err,res)=>{
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("Admin created!")
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/show should show user profile", done=>{
        chai.request(server)
            .get('/api/user/show')
            .set('Authorization', `${tokenLogin}`)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show user details')
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/showAdmin should show all admin", done=>{
        chai.request(server)
            .get('/api/user/showAdmin')
            .set('Authorization', `${tokenLogin}`)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show all admin')
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/client should create client", done=>{
        chai.request(server)
            .post('/api/user/client')
            .send(testClient)
            .end((err,res)=>{
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("Client created!")
                res.body.should.have.property('result')
                tokenEmail = res.body.result.token
                done()
            })
    })

    it("GET /api/user/verify/:token should verify email", done=>{
        chai.request(server)
            .get(`/api/user/verify/${tokenEmail}`)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("email verified success")
                res.body.should.have.property('result')
                done()
            })
    })


})