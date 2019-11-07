process.env.NODE_ENV = 'test'

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
            .post('/api/user/login')
            .send({
                login: "client",
                password: '123456'
            })
            .end((err, res)=> {
                token = res.headers.authorization.toString()
                expect(token).to.be.a('string')
                done()
            })
    })

    it('SHOW NO PENDING REQUEST', function(done) {
        chai.request(server)
            .get('/api/saldo/show/pending')
            .set('Authorization', token)
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })
    
    it('CREATE TOP UP SALDO INPUT FALSE', function(done) {
        chai.request(server)
            .post('/api/saldo')
            .send({
                
            })
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE TOP UP SALDO', function(done) {
        chai.request(server)
            .post('/api/saldo')
            .send({
                value: 1200000,
                isVerified: false,
                status: 'pending'
            })
            .set('Authorization', token)
            .end(function (err, res) {
                saldoId = res.body.result._id
                fakeId = saldoId.replace("5", "4")
                expect(res).to.have.status(201)
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

    it('CREATE TOP UP SALDO', function(done) {
        chai.request(server)
            .post('/api/saldo')
            .send({
                value: 1200000,
                isVerified: false,
                status: 'pending'
            })
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res.status).to.equal(409)
                done()
            })
    })

    it('SHOW PENDING REQUEST', function(done) {
        chai.request(server)
            .get('/api/saldo/show/pending')
            .set('Authorization', token)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
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

    it('SHOW ALL REQ SALDO IN USER SHOULD SHOW OK', function (done) {

        chai.request(server)
            .get('/api/saldo/detail/pending')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('SHOW ALL USER HISTROY IN USER SHOULD SHOW OK', function (done) {

        chai.request(server)
            .get('/api/saldo/detail/history')
            .set('Authorization', token)
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

    it('DECLINED SALDO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .put(`/api/saldo/declined/${saldoId}`)
            .set('Authorization', adminToken)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })


    it('CANCEL REQ SALDO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .delete(`/api/saldo/cancel/${saldoId}`)
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

})