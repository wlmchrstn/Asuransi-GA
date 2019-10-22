process.env.NODE_ENV = 'test'
const promo = require('../../models/insurance');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;
chai.use(chaiHttp)


describe('FORM OPERATION', ()=> {
    
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
                console.log(insurance_id)
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    before(done => {
        chai.request(server)
            .post('/api/user/client')
            .send({
                name: 'William',
                username: 'wlmchrstn',
                email: 'wlmchrstn@gmail.com',
                password: 'abc5dasar'
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
            .post('/api/user/client')
            .send({
                name: 'Fake',
                username: 'fake',
                email: 'fake@gmail.com',
                password: 'fakedasar'
            })
            .end((err, res)=> {
                fakeId = res.body.result._id
                fakeToken = res.body.result.token
                expect(res.status).to.be.equal(201)
                done()
            })
    })

    before(done => {
        chai.request(server)
            .get(`/api/user/verify/${clientToken}`)
            .send({})
            .end((err, res)=> {
                done()
            })
    })

    before(done => {
        chai.request(server)
            .get(`/api/user/verify/${fakeToken}`)
            .send({})
            .end((err, res)=> {
                done()
            })
    })

    before(done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: "wlmchrstn",
                password: 'abc5dasar'
            })
            .end((err, res)=> {
                token = res.body.result.toString()
                done()
            })
    })

    before(done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: "fake",
                password: 'fakedasar'
            })
            .end((err, res)=> {
                fakeClientToken = res.body.result.toString()
                done()
            })
    })

    it('CREATE FORM', function(done) {
        chai.request(server)
            .post(`/api/form/${insurance_id}`)
            .send({
                name: "william",
                NIK: 1671064507980011,
                gender: "MALE",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                status: "Single",
                phone: 082278001173,
                NPWP: "1234566789012345",
                address: "BATAM",
                city: "BATAM",
                postalCode: 25122,
                No_KK: 1671064507980011,
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office"
            })
            .set('Authorization', clientToken)
            .end(function (err, res) {
                formId = res.body.result._id
                console.log(formId)
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('FAILED TO CREATE FORM', (done)=> {
        chai.request(server)
            .post(`/api/form/${insurance_id}`)
            .set('authorization', token)
            .send({
                field: "isField"
            })
            .end((err, res)=> {
                expect(res.status).to.equal(422)
                done()
            })
    })

    it('GET USER FORM', (done)=> {
        chai.request(server)
            .get('/api/form')
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                idForm = res.body.result[0]._id.toString()
                expect(res.status).to.equal(200)
                done()
            })
    })
    
    it('NOT FOUND TO DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${insurance_id}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('UNAUTHORIZE DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${formId}`)
            .set('authorization', fakeClientToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${idForm}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })    
})
