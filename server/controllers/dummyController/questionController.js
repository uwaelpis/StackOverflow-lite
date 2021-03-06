import moment from 'moment';
import data from '../../data';
/**
 * @exports
 * @class QuestionController
 */
class QuestionController {

  /**
       * Returns a list of Questions
       * @method allQuestions
       * @memberof QuestionController
       * @param {object} req
       * @param {object} res
       * @returns {(function|object)} Function next() or JSON object
       */

  static allQuestions(req, res) {
    return res.status(200).json(data.questions);
  }

  /**
       * Returns a Question
       * @method postQuestions
       * @desc remove userId from req.body, it should be gotten from the middleware
       * @memberof QuestionController
       * @param {object} req
       * @param {object} res
       * @returns {(function|object)} Function next() or JSON object
       */
  static postQuestions(req, res) {

    const { userId, questionTitle, questionBody } = req.body;
    const allQuestions = data.questions;
    const id = allQuestions[allQuestions.length - 1].id + 1;
    const createdAt = moment().format('YYYY-MM-DD');
    const updatedAt = moment().format('YYYY-MM-DD');

    const newQuestion = {
      id, userId, questionTitle, questionBody, createdAt, updatedAt
    }

    const answerId = -1;
    const questionId = id;
    const newPreferredAnswer = { id, questionId, answerId };

    if (questionTitle === '' || questionTitle === undefined) {
      return res.status(400).json({ message: 'A Title field is required', error: 'Bad Request' })
    }
    if (questionBody === '' || questionBody === undefined) {
      return res.status(400).json({ message: 'A question body is required', error: 'Bad Request' })
    }

    allQuestions.push(newQuestion);
    data.preferredAnswers.push(newPreferredAnswer);

    return res.status(201).json({ message: 'Question added successfully', 'Question Title': newQuestion.questionTitle, 'Question body': newQuestion.questionBody });


  }

  /**
       * Returns a Question
       * @method getQuestion
       * @memberof QuestionController
       * @param {object} req
       * @param {object} res
       * @returns {(function|object)} Function next() or JSON object
       */

  static getQuestion(req, res) {
    const questionId = QuestionController.questionId(req);
    const allQuestions = data.questions;
    if (typeof (questionId) === 'number' && Math.round(questionId) === questionId) {
      return res.status(400).json({ message: 'Id should be a number' });
    }
    const findQuestion = allQuestions.findIndex(quest => quest.id === parseInt(questionId, 10))
    if (findQuestion < 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const allAnswers = data.answers;

    const findAnswer = allAnswers.filter(ans => ans.questionId == parseInt(questionId, 10));

    


    if (findAnswer.length !== 0) {
      return res.status(200).json({
        'Question Title': allQuestions[findQuestion].questionTitle, 'Question Body': allQuestions[findQuestion].questionBody, 'All Answers': findAnswer
      })


    }
    return res.status(200).json({ 'Question Title': allQuestions[findQuestion].questionTitle, 'Question Body': allQuestions[findQuestion].questionBody, ' Answers': 'None provided Yet' })

  }



  /**
       * Returns a message
       * @method deleteQuestion
       * @memberof QuestionController
       * @param {object} req
       * @param {object} res
       * @returns {(function|object)} Function next() or JSON object
       */

  static deleteQuestion(req, res) {
    const questionId = QuestionController.questionId(req);

    const allQuestions = data.questions;
    const findQuestion = allQuestions.findIndex(quest => quest.id === parseInt(questionId, 10));
    if (findQuestion === -1) {
      return res.status(404).json({ message: 'Question doesn\'t exist' });
    }
    allQuestions.splice(findQuestion, 1);

    return res.status(200).json({ message: 'Question has been deleted!' });


  }






  static questionId(req) {
    return req.params.questionId;
  }

  static answerId(req) {
    return req.params.answerId;
  }

  static getPreferredAnswer(req) {
    const questionid = QuestionController.questionId(req);


    const findQuestion = data.preferredAnswers.findIndex(question => question.questionId === parseInt(questionid, 10));

    if (findQuestion === -1) {
      return null;
    }
    const preferAnswerDb = data.preferredAnswers[findQuestion];

    const preferredId = preferAnswerDb.answerId;
    return preferredId;

  }
}

export default QuestionController;
