import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';
import data from '../data/testdata.json';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET all questions endpoint', () => {

  it('should return a 200', (done) => {
    chai.request(app)
      .get('/api/v1/questions')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        done();
      });
  });

});

describe('GET endpoint for a question', () => {
  it('should return an 200', (done) => {
    chai.request(app)
      .get('/api/v1/questions/2')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });

  it('should return 404 if question doesnt exist ', (done) => {
    const noQuestionApi = '/api/v1/questions/100';
    chai.request(app)
      .get(noQuestionApi)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Question not found');
        // expect(response.body.request).to.be.an('array');
        done();
      });
  });
});

describe('POST endpoint for questions', () => {
  const api = '/api/v1/questions';
  it('should not add a question with no title', (done) => {
    chai.request(app)
      .post(api)
      .send(data.noTitleQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('A Title field is required');
        expect(response.body.error).to.equal('Bad Request');
        done();
      });
  });

  it('should not add a question with no body ', (done) => {
    chai.request(app)
      .post(api)
      .send(data.noBodyQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('A question body is required');
        expect(response.body.error).to.equal('Bad Request');
        done();
      });
  });



  it('should return 201 for a successful post request ', (done) => {
    chai.request(app)
      .post(api)
      .send(data.goodQuestion)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Question added successfully');
        expect(response.body).to.be.an('object');
        // expect(response.body.request).to.be.an('array');
        done();
      });
  });
});


// Adding an answer
describe('POST endpoint for answers', () => {
  const api = '/api/v1/questions/1/answers';
  const noQuestionApi = '/api/v1/questions/50/answers';
  it('should not add an empty answer', (done) => {
    chai.request(app)
      .post(api)
      .send(data.noContentAnswer)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('An answer field is required, Please fill up field');
        expect(response.body.error).to.equal('Bad Request');
        done();
      });
  });

  it('should return 201 for a successful post request ', (done) => {
    chai.request(app)
      .post(api)
      .send(data.goodAnswer)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Answer added successfully');
        expect(response.body).to.be.an('object');
        // expect(response.body.request).to.be.an('array');
        done();
      });
  });

  it('should return 404 if question doesnt exist ', (done) => {
    chai.request(app)
      .post(noQuestionApi)
      .send(data.goodAnswer)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Question not found');
        // expect(response.body.request).to.be.an('array');
        done();
      });
  });
});

describe('GET all answers endpoint', () => {

  it('should return a 200', (done) => {
    chai.request(app)
      .get('/api/v1/questions/2/answers')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        done();
      });
  });

});

describe('DELETE endpoint for a question', () => {

  it('should return an 200', (done) => {
    chai.request(app)
      .delete('/api/v1/questions/2')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Question has been deleted!');
        done();
      });
  });

  it('should return 404 if question doesnt exist ', (done) => {
    const noQuestionApi = '/api/v1/questions/100';
    chai.request(app)
      .delete(noQuestionApi)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Question doesn\'t exist');
        // expect(response.body.request).to.be.an('array');
        done();
      });
  });

});

describe('PUT endpoint for a preferred answer', () => {

  it('should return an 201', (done) => {
    chai.request(app)
      .put('/api/v1/questions/2/answers/1/preferred')
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('The preferred Answer has been choosen');
        done();
      });
  });

  it('should return 404 if question doesnt exist ', (done) => {
    const noQuestionApi = '/api/v1/questions/100/answers/1/preferred';
    chai.request(app)
      .put(noQuestionApi)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('The question is not found');
        // expect(response.body.request).to.be.an('array');
        done();
      });
  });

});