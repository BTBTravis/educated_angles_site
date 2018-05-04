//load env
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.load();
}
import sinon from 'sinon';
import chai from 'chai';
const expect = chai.expect;

import createCockpitAPI from '../models/cockpit.js';
import axios from 'axios';

let realServices = {
  axios: axios,
  env: {
    cockpitPath: process.env.COCKPIT_PATH,
    cockpitToken: process.env.COCKPIT_TOKEN
  }
};

describe('Cockpit Module', function () {
  let cockpit = createCockpitAPI(realServices);

  it('getHomePageSections', () => {
    return cockpit.getHomePageSections()
      .then(res => {
        expect(res).to.have.property('sections');
        expect(res).to.have.property('titles');
        res.sections.forEach(section => {
          expect(section.body_content).to.be.an('string');
          expect(section.background_image.path).to.be.an('string');
          expect(section.background_image.path.includes('http')).to.equal(true);
        });
      });
  });

  it('getHomePageCards', () => {
    return cockpit.getHomePageCards()
      .then(res => {
        expect(res).to.be.an('array');
        res.forEach(card => {
          expect(card.title).to.be.an('string');
          expect(card.body).to.be.an('string');
          expect(card.background_image.path).to.be.an('string');
        });
      });
  });

  it('getEvents', () => {
    return cockpit.getEvents()
      .then(res => {
        expect(res).to.be.an('array');
        res.forEach(evt => {
          expect(evt.title).to.be.an('string');
          expect(evt.url).to.be.an('string');
          expect(evt.date).to.be.an('string');
        });
      });
  });
});

