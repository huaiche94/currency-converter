const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('./app');

const request = supertest(app);

describe('Currency Conversion API', () => {
    //////////////////////////////
    ////        source        ////
    //////////////////////////////
  it('should return "Invalid source" for invalid currency (source)', (done) => {
    request
      .get('/convert?source=XYZ&target=JPY&amount=$1,525')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.msg).to.equal('Invalid source');
        done();
      });
  });
    //////////////////////////////
    ////        target        ////
    //////////////////////////////
  it('should return "Invalid target" for invalid currency (target)', (done) => {
    request
      .get('/convert?source=TWD&target=XYZ&amount=$1,525')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.msg).to.equal('Invalid target');
        done();
      });
  });
    //////////////////////////////
    ////        amount        ////
    //////////////////////////////
  it('should return "Invalid amount format" for invalid amount format', (done) => {
    request
      .get('/convert?source=USD&target=JPY&amount=invalid')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.msg).to.equal('Invalid amount format. Amount should start with $ and use comma as thousands separator');
        done();
      });
  });

  it('should return converted amount for valid input', (done) => {
    request
      .get('/convert?source=USD&target=JPY&amount=$1,525')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.msg).to.equal('success');
        expect(res.body.amount).to.equal('$170496.53');
        done();
      });
  });
});
