var chai = require('chai');
var expect = chai.expect;

var { success, error  } = require('../../helpers/response')

describe('Response Helpers', function() {

    before(() => 
     sampleData = {
         username: 'foo',
         email: 'foo.mail.com'
     },
     errSample = new Error()
     )

     it('Success response show oke', function () {
         var response = success('success', sampleData)
         expect(response.success).to.be.true
         expect(response.result).to.be.a('object')
     })

     it('Error response show oke', function () {
        var response = error('failed', errSample)
        expect(response.success).to.be.false
    })

}) 
