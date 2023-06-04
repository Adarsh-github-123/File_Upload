const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();


const API = process.env.BASE_URL;
chai.use(chaiHttp);

// describe("/POST testing user signup", () => {
//     it("creates a new user", () => {
//         chai.request(API)
//         .post("/api/v1/user/signup")
//         .send({
//             name: "Ramesh Singh",
//             email: "ramesh123@gmail.com",
//             password: "ASDFa!@#$34"
//         })
//         .end((err, res) => {
//             res.should.have.status(201);
//             res.body.should.have.a("object");
//             res.body.should.have.property("message");
//             res.body.message.should.contain("Welcome Ramesh Singh");
//         })
//     })
// })

describe("/GET testing user signout", () => {
    it("signout user", () => {
        chai.request(API)
        .get("/api/v1/user/signout")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.a("object");
            res.body.should.have.property("message");
            res.body.message.should.contain("Cookie is Deleted");
            done();
        })
    })
})

