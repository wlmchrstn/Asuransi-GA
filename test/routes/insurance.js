var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var insurance = require('../../models/insurance');
var expect = chai.expect

chai.use(chaiHttp);

let id;
let token;
let fakeToken = 'thisisfaketoken'


describe('Create Insurance', function() {

    beforeEach(function (done) {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: 'admin',
                password: '12345678'
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
                console.log(id)
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
            .get(`/api/insurance/${id}`)
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

})