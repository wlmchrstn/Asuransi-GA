var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var expect = chai.expect;
var fs = require('fs');
var Saldo = require('../../models/saldo');
chai.use(chaiHttp);

let token;
let file = process.env.PICT
let adminToken;

describe('SALDO', function() {
    
    before(function (done) {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: 'admin',
                password: '12345'
            })
            .end(function (err, res) {
                adminToken = res.headers.authorization
                done()
            })
    })

    before(done => {
        chai.request(server)
            .post('/api/user/client')
            .send({
                name: 'user',
                username: 'user',
                email: 'user@gmail.com',
                password: '12345'
            })
            .end((err, res)=> {
                clientId = res.body.result._id
                clientToken = res.body.result.token
                expect(res.status).to.be.equal(201)
                done()
            })
    })

    before(done => {
        chai.request(server)
            .get(`/api/user/verify/${clientToken}`)
            .send({})
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    before(done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: "user",
                password: '12345'
            })
            .end((err, res)=> {
                token = res.headers.authorization.toString()
                expect(token).to.be.a('string')
                done()
            })
    })

    it('CREATE TOP UP SALDO', function(done) {
        chai.request(server)
            .post('/api/saldo')
            .send({
                value: 120000
            })
            .set('Authorization', token)
            .end(function (err, res) {
                saldoId = res.body.result._id
                console.log(saldoId)
                fakeId = saldoId.replace("5", "4")
                console.log(fakeId)
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE TOP UP SALDO', function(done) {
        chai.request(server)
            .post('/api/saldo')
            .send({
                value: 'abc'
            })
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UPLOAD FOTO SHOULD SHOW OK', function () {

        chai.request(server)
            .put(`/api/saldo/upload/${saldoId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
            })
    })

    it('SHOW ALL REQ SALDO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .get('/api/saldo')
            .set('Authorization', adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('SHOW ONE REQ SALDO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .get(`/api/saldo/${saldoId}`)
            .set('Authorization', adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('SHOW ONE REQ SALDO THAT NOT EXIST SHOULD SHOW ERROR', function (done) {

        chai.request(server)
            .get(`/api/saldo/5daeb6fb6931e648c70dbefu`)
            .set('Authorization', adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(404)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('ACC SALDO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .put(`/api/saldo/accept/${saldoId}`)
            .set('Authorization', adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('DElETE REQ SALDO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .delete(`/api/saldo/${saldoId}`)
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

})