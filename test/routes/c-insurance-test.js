process.env.NODE_ENV = 'test'

var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var expect = chai.expect;
var fs = require('fs')
var Insurance = require('../../models/insurance')
chai.use(chaiHttp);

let token;
let fakeToken = 'thisisfaketoken'
let fakeId = '5d92cf8c3a0f164515577b21'
let file = process.env.PICT

describe('Insurance', function(done) {

    before(function (done) {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: 'admin',
                password: '12345'
            })
            .end(function (err, res) {
                token = res.headers.authorization
                done()
            })
    })

    after(done => {
        Insurance.deleteMany({})
            .then(result => {
                done()
            })
    })

    it('CREATE INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .post('/api/insurance/create')
            .send({
                name_insurance: 'Asuransi Kesehatan',
                description: 'Asuransi Kesehatan',
                premi: '200.000 per bulan',
                price: '15000',
                price_promo: '0',
                isPromo: 0,
                time_insurance: 'Sampai usia 90 tahun',
                range_age: '0 - 70 Tahun',
                benefit: 'Murah dan cepat',
                currency: 'IDR'
            })
            .set('Authorization', token)
            .end(function(err, res) {
                insurance_id = res.body.result._id
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE FAILED INSURANCE SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .post('/api/insurance/create')
            .send({
                name_insurance: '',
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
            .get('/api/insurance')
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

    it('SHOW ONE INSURANCE THAT IS NOT FOUND SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .get('/api/insurance/detail/5d92cf8c3a0f164515577b21')
            .end(function(err, res) {
                expect(res).to.have.status(404)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UPDATE INSURANCE SHOULD SHOW OK', function(done) {

        chai.request(server)
            .put(`/api/insurance/update/${insurance_id}`)
            .set('Authorization', token)
            .send({
                isPromo: 1,
                price_promo: "20000"
            })
            .end(function(err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('FAILED UPDATE INSURANCE SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .put(`/api/insurance/update/${insurance_id}`)
            .set('Authorization', token)
            .send({
                price_promo: null,
                isPromo: null
            })
            .end(function(err, res) {
                expect(res).to.have.status(400)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('FAILED UPDATE INSURANCE SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .put(`/api/insurance/update/${insurance_id}`)
            .set('Authorization', token)
            .send({
                price: "",
                isPromo: ""
            })
            .end(function(err, res) {
                expect(res).to.have.status(400)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('FAILED UPDATE INSURANCE SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .put(`/api/insurance/update/${insurance_id}`)
            .set('Authorization', token)
            .send({
                price: "ab",
                isPromo: "ab"
            })
            .end(function(err, res) {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UPLOAD FOTO SHOULD SHOW OK', function () {

        chai.request(server)
            .put(`/api/insurance/${insurance_id}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
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

    it('DELETE INSURACE, THAT IS NOT EXIST SHOULD SHOW ERROR', function(done) {

        chai.request(server)
            .delete(`/api/insurance/delete/5d92cf8c3a0f164515577b21`)
            .set('Authorization', token)
            .end(function(err, res) {
                expect(res).to.have.status(404)
                expect(res).to.be.an('object')
                done()
            })
    })


})
