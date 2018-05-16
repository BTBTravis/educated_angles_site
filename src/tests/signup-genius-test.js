//load env
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.load();
}
import sinon from 'sinon';
import chai from 'chai';
const expect = chai.expect;

import createSignupGeniusAPI from '../models/signup-genius.js';
import axios from 'axios';
import moment from 'moment';

let realServices = {
  axios: axios,
  moment: moment,
  env: {
    key: process.env.SIGNUPGENIUS_KEY
  }
};

describe('SignUpGenius Module', function () {
  this.timeout(30000);
  let signup = createSignupGeniusAPI(realServices);
  it('getEvents', () => {
    return signup.getEvents()
      .then(res => {
        expect(res).to.be.an('Array');
        res.forEach(x => {
          expect(x.mainimage).to.be.an('string');
          expect(x.thumbnail).to.be.an('string');
          expect(x.title).to.be.an('string');
          expect(x.signupurl).to.be.an('string');
          expect(x.event_type).to.be.an('string');
          expect(x.month).to.be.an('string');
          expect(x.day).to.be.an('string');
        });
      });
  });
});

