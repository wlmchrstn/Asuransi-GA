var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var insurance = require('../../models/insurance');
var expect = chai.expect;
var fs = require('fs')

chai.use(chaiHttp);

let token;
let fakeToken = 'thisisfaketoken'
let file = '/home/ayumhrn/project/backend/public/images/profpict.png'
let wrongfile = '/home/ayumhrn/project/backend/app.js'



describe('Insurance', function() {


    before(done => {
        chai.request(server)
            .post('/api/user/admin')
            .send({
                username: 'admin',
                name: 'Ayu admin',
                email: 'admin@gmail.com',
                password: '12345'
            })
            .end(() => {
                insurance.deleteMany({},
                    {new: true})
                    .exec(() => {
                        done()
                    })
            })
    })


    beforeEach(function (done) {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: 'admin',
                password: '12345'
            })
            .end(function (err, res) {
                if (err) {
                    console.log(err)
                }
                token = res.header.authorization
                done()
                
            })
    })

    it('CREATE INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .post('/api/insurance/create')
            .send({
                title: 'Asuransi Kesehatan',
                description: 'Asuransi Kesehatan',
                price: '15000'
            })
            .set('Authorization', token)
            .end(function(err, res) {
                insurance_id = res.body.result._id
                console.log(insurance_id)
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE FAILED INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .post('/api/insurance/create')
            .send({
                title: '',
                description: '',
                price: ''
            })
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('SHOW ALL INSURANCE SHOW OK', function(done) {

        chai.request(server)
            .get('/api/insurance/')
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('SHOW ONE INSURANCE SHOW OK', function(done) {

        chai.request(server)
            .get(`/api/insurance/detail/${insurance_id}`)
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UPDATE INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .put(`/api/insurance/${insurance_id}`)
            .set('Authorization', token)
            .send({
                price: "20000"
            })
            .end(function(err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('FAILED UPDATE INSURANCE SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .put(`/api/insurance/${insurance_id}`)
            .set('Authorization', token)
            .send({
                price: "ab"
            })
            .end(function(err, res) {
                expect(res).to.have.status(400)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UPLOAD FOTO SHOULD SHOW OK', function (done) {

        chai.request(server)
            .post(`/api/insurance/${insurance_id}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('SEARCH INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .get(`/api/insurance/search?title=Asuransi Kesehatan`)
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('DELETE INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .delete(`/api/insurance/delete/${insurance_id}`)
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })


})