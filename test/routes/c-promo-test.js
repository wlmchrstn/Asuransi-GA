process.env.NODE_ENV = 'test'

var chaiHttp = require('chai-http');
var chai = require('chai');
var server = require('../../app');
var promo = require('../../models/insurance');
var expect = chai.expect;

chai.use(chaiHttp);

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
                promo.deleteMany({},
                    {new: true})
                    .exec(() => {
                        done()
                    })
            })
    })


    before(function (done) {
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

    before(function (done) {
        chai.request(server)
            .post('/api/insurance/create')
            .send({
                name_insurance: 'Asuransi Kesehatan',
                type: 'kesehatan',
                description: 'Asuransi Kesehatan',
                premi: '200.000 per bulan',
                price: '15000',
                isPromo: 0,
                time_insurance: 'Sampai usia 90 tahun',
                range_age: '0 - 70 Tahun',
                max_person: '5 Orang'
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
