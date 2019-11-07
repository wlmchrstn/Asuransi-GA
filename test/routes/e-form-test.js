process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;
const fs = require('fs')
chai.use(chaiHttp)

let file = process.env.PICT

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

    before(function (done) {
        chai.request(server)
            .post('/api/insurance/create')
            .send({
                name_insurance: 'Asuransi Kesehatan',
                description: 'Asuransi Kesehatan',
                premi: '200.000 per bulan',
                price: '15000',
                price_promo: '1000',
                isPromo: true,
                time_insurance: 'Sampai usia 90 tahun',
                range_age: '0 - 70 Tahun',
                benefit: 'Murah dan cepat',
                currency: 'IDR'
            })
            .set('Authorization', adminToken)
            .end(function(err, res) {
                promo_id = res.body.result._id
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
                clientFake = clientId.replace("5", "4")
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
                password: '123456'
            })
            .end((err, res)=> {
                token = res.header.authorization
                userId = res.body.result._id
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

    before(done => {
        chai.request(server)
            .put('/api/user/update')
            .send({
                name: 'william',
                gender: 'Male',
                phone: '082278001173',
                address: 'Batam',
                birthPlace: 'Dumai',
                birthDate: '2000-01-11'
            })
            .set('Authorization', token)
            .end((err, res)=> {
                expect(res.status).to.equal(200)
                done()
            })
    })

    it('CREATE FORM', function(done) {
        chai.request(server)
            .post(`/api/form/${insurance_id}`)
            .send({
                name: "william",
                NIK: '1671064507980011',
                gender: "Male",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                age: 17,
                blood_type: 'A',
                status: "Single",
                NPWP: "1234566789012345",
                address: "BATAM",
                city: "BATAM",
                postalCode: 25122,
                No_KK: '1671064507980011',
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office",
                penyakit_sekarang: 'maag',
                penyakit_dulu: 'tidak ada'
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

    it('BUY INSURANCE STILL PENDING', (done)=> {
        chai.request(server)
            .put(`/api/form/buy/${formId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('CREATE FORM', function(done) {
        chai.request(server)
            .post(`/api/form/${promo_id}`)
            .send({
                name: "william",
                NIK: '1671064507980011',
                gender: "Male",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                age: 17,
                blood_type: 'A',
                status: "Single",
                NPWP: "1234566789012345",
                address: "BATAM",
                city: "BATAM",
                postalCode: 25122,
                No_KK: '1671064507980011',
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office",
                penyakit_sekarang: 'maag',
                penyakit_dulu: 'tidak ada'
            })
            .set('Authorization', token)
            .end(function (err, res) {
                ndFormId = res.body.result._id
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
                gender: "Male",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                age: 17,
                blood_type: 'A',
                status: "Single",
                NPWP: "1234566789012345",
                address: "BATAM",
                city: "BATAM",
                postalCode: 25122,
                No_KK: '1671064507980011',
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office",
                penyakit_sekarang: 'maag',
                penyakit_dulu: 'tidak ada',
                status_pembayaran: 'pending',
                isVerified: false,
                isRewiewed: false
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
                gender: "Male",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                age: 17,
                blood_type: 'A',
                status: "Single",
                NPWP: "1234566789012345",
                address: "BATAM",
                city: "BATAM",
                postalCode: 25122,
                No_KK: 1671064507980011,
                email: "wlmchrstn@gmail.com",
                job: "Wiraswata",
                position: "Office",
                penyakit_sekarang: 'maag',
                penyakit_dulu: 'tidak ada'
            })
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(406)
                expect(res.body).to.be.an('object')
                expect(res.body.message).to.be.equal('Nomor KK Must have 16 characters')
                done()
            })
    })

    it('UPLOAD FOTO KK SHOULD SHOW OK', function () {

        chai.request(server)
            .put(`/api/form/upload/kk/${formId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
            })
    })

    it('UPLOAD FOTO NPWP SHOULD SHOW OK', function () {

        chai.request(server)
            .put(`/api/form/upload/npwp/${formId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
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

    it('GET DETAIL FORM THAT NOT EXIST SHOULD SHOW ERR', (done)=> {
        chai.request(server)
            .get(`/api/form/${fakeId}`)
            .set('authorization', token)
            .end((err, res)=> {
                expect(res.status).to.equal(404)
                done()
            })
    })

    it('SHOW ALL FORM FROM USER BY ADMIN SHOULD SHOW OK', (done)=> {
        chai.request(server)
            .get(`/api/form/showAll/${userId}`)
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(200)
                done()
            })
    })

    it('SHOW ALL FORM FROM THAT ACTIVE SHOW OK', (done)=> {
        chai.request(server)
            .get(`/api/form/active/all`)
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(200)
                done()
            })
    })

    it('VERIFY FROM SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/verify/${formId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(201)
                done()
            })
    })

    it('VERIFY FROM SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/verify/${ndFormId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(201)
                done()
            })
    })

    it('UPDATE REVIEW FROM SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/review/${formId}`)
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(201)
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

    it('BUY INSURANCE SHOULD SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/buy/${ndFormId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(200)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('BUY INSURANCE THAT NOT EXIST SHOULD SHOW ERROR', (done)=> {
        chai.request(server)
            .put(`/api/form/buy/${clientId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(404)
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

    it('PAY INSURANCE THAT USER IS NOT SAME SHOULD SHOW ERROR', (done)=> {
        chai.request(server)
            .put(`/api/form/pay/${formId}`)
            .set('Authorization', fakeToken)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(403)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('REJECT FORM SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/reject/${formId}`)
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(201)
                done()
            })
    })

    it('BUY INSURANCE FORM REJECTED', (done)=> {
        chai.request(server)
            .put(`/api/form/buy/${formId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res).to.have.status(406)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('UNAUTHORIZE DELETE FORM', (done)=> {
        chai.request(server)
            .delete(`/api/form/${fakeId}`)
            .set('Authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.equal(404)
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
