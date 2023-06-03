const { validateName, 
    validateEmail, 
    validatePassword } = require("../utils/validators");


var expect = require("chai").expect;

describe("Testing validators", function(){
    it("should return true for a valid name", function() {
        expect(validateName("Adarsh")).to.equal(true)
    });

    it("should return false for a invalid name", function() {
        expect(validateName("Adarsh007")).to.equal(false)
    });

    it("should return true for a valid email", function() {
        expect(validateEmail("sm47@gmail.com")).to.equal(true)
    });

    it("should return true for valid password", function() {
        expect(validatePassword("HelloWorld@6")).to.equal(true)
    });

    it("should return false for a invalid email", function() {
        expect(validateEmail("sm47.gmail.com")).to.equal(false)
    });
})