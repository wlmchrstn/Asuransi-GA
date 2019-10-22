process.env.NODE_ENV = 'test'

var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var promo = require('../../models/insurance');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Insurance', function() {

    before(function (done) {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: 'admin',
                password: '12345'
            })
            .end(function (err, res) {
                token = res.header.authorization
                done()
                
            })
    })

    before(function (done) {
        chai.request(server)
            .post('/api/insurance/create')
            .send({
                name_insurance: 'Asuransi Kesehatan',
                description: 'Asuransi Kesehatan',
                premi: '200.000 per bulan',
                price: '15000',
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

    it('GET ALL PROMO', function(done) {

        chai.request(server)
            .get('/api/promo')
            .end(function(err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })
})
