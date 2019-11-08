process.env.NODE_ENV = 'test'

const User = require('../../models/user')
const funcHelper = require('../../helpers/funcHelper')

const server = require('../../app')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect;
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken');

chai.use(chaiHttp)

describe('USER CONTROLLER', () => {

    before((done) => {
        User.deleteMany({}, (err) => {
            done()
        })
    })

    var testAdmin = {
        name: 'admin',
        username: 'admin',
        email: 'admin@gmail.com',
        password: '12345'
    }

    var testClient = {
        name: 'client',
        username: 'client',
        email: 'client@gmail.com',
        password: '123456'
    }

    it("POST /api/user/super should create super admin", done => {
        chai.request(server)
            .post('/api/user/super')
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/super should not create super admin", done => {
        chai.request(server)
            .post('/api/user/super')
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal("You can only create super admin once")
                done()
            })
    })

    it("POST /api/user/login should not login", done => {
        chai.request(server)
            .post('/api/user/login')
            .send({ username: 'super_admin', password: '123456' })
            .end((err, res) => {
                res.should.have.status(422)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Failed to login!')
                done()
            })
    })

    it("POST /api/user/login should login", done => {
        chai.request(server)
            .post('/api/user/login')
            .send({ login: 'superadmin', password: '123456' })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Token created! Access given!')
                res.body.should.have.property('result')
                tokenLogin = res.body.result.token
                done()
            })
    })

    it("POST /api/user/admin should not create admin", done => {
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(422)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Failed to create admin!')
                done()
            })
    })

    it("POST /api/user/admin should create admin", done => {
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', tokenLogin)
            .send(testAdmin)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("Admin created!")
                res.body.should.have.property('result')
                admin = res.body.result
                done()
            })
    })

    it("POST /api/user/show should show user profile", done => {
        chai.request(server)
            .get('/api/user/show')
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show user details')
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/showAdmin should show all admin", done => {
        chai.request(server)
            .get('/api/user/showAdmin')
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show all admin')
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/client should create client", done => {
        chai.request(server)
            .post('/api/user/client')
            .send(testClient)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("Client created!")
                res.body.should.have.property('result')
                tokenEmail = res.body.result.token
                clientId = res.body.result._id
                done()
            })
    })

    it("POST /api/user/login should not login because unverify email", done => {
        chai.request(server)
            .post('/api/user/login')
            .send({ login: 'client', password: '123456' })
            .end((err, res) => {
                res.should.have.status(403)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Please verify email first')
                res.body.should.have.property('error')
                done()
            })
    })

    it("POST /api/user/client should not create client", done => {
        chai.request(server)
            .post('/api/user/client')
            .send({ name: "agam" })
            .end((err, res) => {
                res.should.have.status(422)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Failed to create client!')
                res.body.should.have.property('error')
                done()
            })
    })

    it("POST /api/user/client should not create client", done => {
        chai.request(server)
            .post('/api/user/client')
            .send({ name: "agam", password: "12345" })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Password must be between 6-32 characters')
                res.body.should.have.property('error')
                done()
            })
    })

    it("GET /api/user/verify/:token should not verify email", done => {
        chai.request(server)
            .get(`/api/user/verify/asjknkdg5a7ajk7`)
            .end((err, res) => {
                res.should.have.status(422)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal("Invalid token")
                res.body.should.have.property('error')
                done()
            })
    })

    it("GET /api/user/verify/:token should verify email", done => {
        chai.request(server)
            .get(`/api/user/verify/${tokenEmail}`)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it("POST /api/user/login should not login because wrong password", done => {
        chai.request(server)
            .post('/api/user/login')
            .send({ login: 'client', password: '1234567' })
            .end((err, res) => {
                res.should.have.status(403)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Password incorrect!')
                done()
            })
    })

    it("POST /api/user/verify should not resend verify email", done => {
        chai.request(server)
            .post(`/api/user/verify`)
            .send({ email: 'agam@gmail.com' })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal("Incorrect email")
                res.body.should.have.property('error')
                done()
            })
    })

    it("POST /api/user/verify should resend verify email", done => {
        chai.request(server)
            .post(`/api/user/verify`)
            .send(testClient)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("Email verification has been send!")
                res.body.should.have.property('result')
                done()
            })
    })

    it("PUT /api/user/update should update user", done => {
        chai.request(server)
            .put('/api/user/update')
            .send({
                name: 'Admin',
                phone: '082342543653'
            })
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Update user success')
                res.body.should.have.property('result')
                done()
            })
    })

    it("PUT /api/user/update should not update user", done => {
        chai.request(server)
            .put(`/api/user/update`)
            .send({
                name: "ayu",
                birthDate: "ahgsjsagk"
            })
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Update user failed')
                res.body.should.have.property('error')
                done()
            })
    })

    it("PUT /api/user/update/password blank password", done => {
        chai.request(server)
            .put(`/api/user/update/password`)
            .set('Authorization', tokenLogin)
            .send()
            .end((err, res)=> {
                res.should.have.status(400)
                expect(res.body.message).to.be.equal("Failed to update! Password can't be blank!")
                done()
            })
    })

    it("PUT /api/user/update/password update password", done => {
        chai.request(server)
            .put(`/api/user/update/password`)
            .set('Authorization', tokenLogin)
            .send({
                password: "654321"
            })
            .end((err, res)=> {
                res.should.have.status(200)
                expect(res.body.message).to.be.equal("Update user success")
                done()
            })
    })

    it("GET /api/user/selectAdmin/:id should select admin", done => {
        chai.request(server)
            .get(`/api/user/selectAdmin/${admin._id}`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show user success')
                res.body.should.have.property('result')
                done()
            })
    })

    it("GET /api/user/selectAdmin/:id should not select admin", done => {
        chai.request(server)
            .get(`/api/user/selectAdmin/5d95daf6c24bf672`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Show user failed')
                res.body.should.have.property('error')
                done()
            })
    })

    it("DELETE /api/user/deleteAdmin/:id should not delete admin", done => {
        chai.request(server)
            .delete(`/api/user/deleteAdmin/mdkskjasi7`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Delete user failed')
                res.body.should.have.property('error')
                done()
            })
    })

    it("DELETE /api/user/deleteAdmin/:id should delete admin", done => {
        chai.request(server)
            .delete(`/api/user/deleteAdmin/${admin._id}`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Delete user success')
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/admin should create admin", done => {
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', tokenLogin)
            .send(testAdmin)
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal("Admin created!")
                res.body.should.have.property('result')
                done()
            })
    })

    it("POST /api/user/reset-password should not send reset password email", done => {
        chai.request(server)
            .post(`/api/user/reset-password`)
            .end((err, res) => {
                res.should.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Register and verifvy email first')
                res.body.should.have.property('error')
                done()
            })
    })

    it("POST /api/user/reset-password should send reset password email", done => {
        chai.request(server)
            .post(`/api/user/reset-password`)
            .send({ email: 'client@gmail.com' })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message')
                res.body.should.have.property('result')
                tokenPassword = res.body.result
                done()
            })
    })

    it("POST /api/user/reset/:token should not change password", done => {
        chai.request(server)
            .put(`/api/user/reset`)
            .send({ password: '12345' })
            .end((err, res) => {
                res.should.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('The token is expired or invalid')
                done()
            })
    })

    it("POST /api/user/reset should change password", done => {
        chai.request(server)
            .put(`/api/user/reset`)
            .send({ password: '123456', token: tokenPassword })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Password successfully updated!')
                done()
            })
    })

    it("GET /api/user/showClient should show all client", done => {
        chai.request(server)
            .get(`/api/user/showClient`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show all client')
                res.body.should.have.property('result')
                done()
            })
    })

    it("GET /api/user/showClient/:id should select client", done => {
        chai.request(server)
            .get(`/api/user/showClient/${clientId}`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('message').equal('Show selected clients details')
                res.body.should.have.property('result')
                done()
            })
    })

    it("GET /api/user/showClient/:id should not select client because wrong id", done => {
        chai.request(server)
            .get(`/api/user/showClient/nkasdui7adiujh889`)
            .set('Authorization', tokenLogin)
            .end((err, res) => {
                res.should.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('message').equal('Client not found')
                res.body.should.have.property('error')
                done()
            })
    })

})
