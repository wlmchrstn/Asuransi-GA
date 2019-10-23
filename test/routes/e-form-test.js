process.env.NODE_ENV = 'test'
const promo = require('../../models/insurance');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;
chai.use(chaiHttp)


describe('FORM OPERATION', ()=> {
    
    before(function (done) {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: 'admin',
                password: '12345'
            })
            .end(function (err, res) {
                adminToken = res.header.authorization
                expect(adminToken).to.be.a('string')
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
            .set('Authorization', adminToken)
            .end(function(err, res) {
                insurance_id = res.body.result._id
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
                login: "client",
                password: '12345'
            })
            .end((err, res)=> {
                token = res.header.authorization.toString()
                expect(token).to.be.a('string')
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
                fakeToken = res.header.authorization.toString()
                expect(fakeToken).to.be.a('string')
                done()
            })
    })

    it('CREATE FORM', function(done) {
        chai.request(server)
            .post(`/api/form/${insurance_id}`)
            .send({
                name: "william",
                NIK: '1671064507980011',
                gender: "MALE",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                status: "Single",
                phone: 082278001173,
                NPWP: "1234566789012345",
                address: "BATAM",
                city: "BATAM",
                postalCode: 25122,
                No_KK: '1671064507980011',
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office"
            })
            .set('Authorization', token)
            .end(function (err, res) {
                formId = res.body.result._id
                fakeId = formId.replace("5", "4")
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('NIK MUST 16', function(done) {
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
                No_KK: '1671064507980011',
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office"
            })
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(406)
                expect(res.body).to.be.an('object')
                expect(res.body.message).to.be.equal('NIK Must have 16 characters')
                done()
            })
    })

    it('NO KK MUST 16', function(done) {
        chai.request(server)
            .post(`/api/form/${insurance_id}`)
            .send({
                name: "william",
                NIK: '1671064507980011',
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
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(406)
                expect(res.body).to.be.an('object')
                expect(res.body.message).to.be.equal('Nomor KK Must have 16 characters')
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
                expect(res.status).to.equal(200)
                done()
            })
    })
    
    it('GET DETAIL FORM', (done)=> {
        chai.request(server)
            .get(`/api/form/${formId}`)
            .set('authorization', token)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('NOT FOUND TO DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${fakeId}`)
            .set('Authorization', adminToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('BUY INSURANCE SHOULD SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/buy/${formId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('BUY INSURANCE THAT SALDO IS NOT ENOUGH SHOULD SHOW ERROR', (done)=> {
        chai.request(server)
            .put(`/api/form/buy/${formId}`)
            .set('Authorization', fakeToken)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('PAY INSURANCE SHOULD SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/pay/${formId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UNAUTHORIZE DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${formId}`)
            .set('Authorization', fakeToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(403)
                done()
            })
    })

    it('DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${formId}`)
            .set('Authorization', adminToken)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })    
})
