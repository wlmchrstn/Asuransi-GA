process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;
const fs = require('fs')
chai.use(chaiHttp)

let file = process.env.PICT

describe('COMMENT OPERATION', ()=> {
    
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
    
    before(done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: "client",
                password: '123456'
            })
            .end((err, res)=> {
                token = res.body.result.token
                done()
            })
    })
    before(done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login:'admin',
                password:'12345'
            })
            .end((err, res)=> {
                adminToken = res.header.authorization
                expect(adminToken).to.be.a('string')
                done()
            })
    })
    before(done => {
        chai.request(server)
            .post(`/api/form/${insurance_id}`)
            .send({
                name: "william",
                NIK: '1671064507980011',
                gender: "Male",
                birthDate: 2002-04-27,
                birthPlace: "DUMAI",
                age: 17,
                phone: '082278001173',
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
                expect(res).to.have.status(201)
                expect(res).to.be.an('object')
                done()
            })
    })

    it('FAILED TO COMMENT BECAUSE STILL PENDING', done => {
        chai.request(server)
            .post(`/api/comment/${formId}`)
            .set('authorization', token)
            .send({
                comment: 'BAGUUUUSSSS',
                rating: '10'
            })
            .end((err, res)=> {
                expect(res.status).to.be.equal(403)
                done()
            })
    })
    
    it('VERIFY FORM SHOW OK', (done)=> {
        chai.request(server)
            .put(`/api/form/verify/${formId}`)
            .attach('image', fs.readFileSync(`${file}`), 'profpict.png')
            .set('authorization', adminToken)
            .end((err, res)=> {
                expect(res).to.have.status(201)
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

    it('FAILED TO COMMENT', (done)=> {
        chai.request(server)
            .post(`/api/comment/${formId}`)
            .set('authorization', token)
            .send({
                comment: ['asdasd', 'asdasd']
            })
            .end((err, res)=> {
                expect(res.status).to.be.equal(422)
                done()
            })
    })

    it('SUCCESS TO COMMENT', done => {
        chai.request(server)
            .post(`/api/comment/${formId}`)
            .set('authorization', token)
            .send({
                comment: 'BAGUUUUSSSS',
                rating: '10'
            })
            .end((err, res)=> {
                expect(res.status).to.be.equal(201)
                console.log(res.body.result)
                commentId = res.body.result._id.toString()
                done()
            })
    })

    // it('DUPLICATE COMMENT', done => {
    //     chai.request(server)
    //         .post(`api/comment/${formId}`)
    //         .set('authorization', token)
    //         .send({
    //             comment: "ASD??",
    //             rating: "10"
    //         })
    //         .end((err, res)=> {
    //             expect(res.status).to.be.equal(409)
    //             done()
    //         })
    // })

    it('FAILED UPDATE COMMENT', (done)=> {
        chai.request(server)
            .put(`/api/comment/${commentId}`)
            .set('authorization', token)
            .send({
                comment: ['abcd,','abasd'],
                rating: "abcd"
            })
            .end((err, res)=> {
                expect(res.status).to.be.equal(422)
                done()
            })
    })

    it('COMMENT NOT FOUND FOR UPDATE', (done)=> {
        chai.request(server)
            .put(`/api/comment/${clientId}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(404)
                done()
            })
    })

    it('UPDATE COMMENT', (done)=> {
        chai.request(server)
            .put(`/api/comment/${commentId}`)
            .set('authorization', token)
            .send({
                comment: "12345",
                rating: 4
            })
            .end((err, res)=> {
                expect(res.status).to.be.equal(200)
                done()
            })
    })

    it('COMMENT NOT FOUND FOR DELETE', (done)=> {
        chai.request(server)
            .delete(`/api/comment/${clientId}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(404)
                done()
            })
    })

    it('COMMENT DELETED', (done)=> {
        chai.request(server)
            .delete(`/api/comment/${commentId}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(200)
                done()
            })
    })

    it('GET ALL INSURANCE COMMENT', (done)=> {
        chai.request(server)
            .get(`/api/comment/${insurance_id}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(200)
                done()
            })
    })

    it('GET ALL COMMENT', (done)=> {
        chai.request(server)
            .get('/api/comment/')
            .end((err, res)=> {
                expect(res.status).to.be.equal(200)
                done()
            })
    })
})
