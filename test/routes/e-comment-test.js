process.env.NODE_ENV = 'test'
const promo = require('../../models/insurance');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const expect = chai.expect;
chai.use(chaiHttp)

describe('COMMENT OPERATION', ()=> {

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
    
    before(done => {
        chai.request(server)
            .post('/api/user/client')
            .send({
                name: 'Rinko',
                username: 'rinko',
                email: 'rinko@gmail.com',
                password: 'rinko123'
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
                done()
            })
    })
    
    before(done => {
        chai.request(server)
            .post('/api/user/login')
            .send({
                login: "rinko",
                password: 'rinko123'
            })
            .end((err, res)=> {
                token = res.body.result.toString()
                done()
            })
    })

    it("NOT SUPER ADMIN", (done)=> {
        chai.request(server)
            .post('/api/user/admin')
            .set('Authorization', token)
            .end((err,res)=>{
                expect(res.status).to.be.equal(403)
                done()
            })
    })

    it("NOT ADMIN", (done)=> {
        chai.request(server)
            .post('/api/insurance/create')
            .set('Authorization', token)
            .end((err,res)=>{
                expect(res.status).to.be.equal(403)
                done()
            })
    })

    it('INSURANCE NOT FOUND', (done)=> {
        chai.request(server)
            .post(`/api/comment/${clientId}`)
            .set('authorization', token)
            .send({
                users: clientId,
                insurances: clientId,
                comment: "ABCD",
                rating: 5
            })
            .end((err, res)=> {
                expect(res.status).to.be.equal(404)
                done()
            })
    })

    it('FAILED TO COMMENT', (done)=> {
        chai.request(server)
            .post(`/api/comment/${insurance_id}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(422)
                done()
            })
    })

    it('ADD COMMENT', (done)=> {
        chai.request(server)
            .post(`/api/comment/${insurance_id}`)
            .set('authorization', token)
            .send({
                users: clientId,
                insurances: insurance_id,
                comment: "ABCD",
                rating: 5
            })
            .end((err, res)=> {
                commentId = res.body.result._id.toString()
                expect(res.status).to.be.equal(201)
                done()
            })
    })

    it('FAILED UPDATE COMMENT', (done)=> {
        chai.request(server)
            .put(`/api/comment/${commentId}`)
            .set('authorization', token)
            .send({
                comment: 'abcd',
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

    it('GET ALL COMMENT', (done)=> {
        chai.request(server)
            .get(`/api/comment/${insurance_id}`)
            .set('authorization', token)
            .send()
            .end((err, res)=> {
                expect(res.status).to.be.equal(200)
                done()
            })
    })
})
