const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

describe('Routes',() => {
  it('should return json message on / GET', () => {
    chai.request(server)
    .get('/')
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
    })
    .catch((err) => {
      throw err;
    })
  });
  it('should redirect non-github webhooks to / on /start-tune POST', () => {
    chai.request(server)
    .post('/start-tune')
    .then((res) => {
      res.should.redirect;
      res.should.have.status(200);
    })
    .catch((err) => {
      throw err;
    })
  });
  it('should redirect non-github webhooks to / on /new-test POST', () => {
    chai.request(server)
    .post('/start-tune')
    .then((res) => {
      res.should.redirect;
      res.should.have.status(200);
    })
    .catch((err) => {
      throw err;
    })
  });
});