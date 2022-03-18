import { Auth0Provider } from '@bcwdev/auth0provider'
import { pollsService } from '../services/PollsService'
import { questionsService } from '../services/QuestionsService'
import BaseController from '../utils/BaseController'
import { checkRole } from '../utils/CheckRole'

export class PollsController extends BaseController {
  constructor() {
    super('api/polls')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAllPolls)
      .get('/:id', this.getPollById)
      .get('/:id/questions/:questionId', this.getQuestionById)
      .use(checkRole)
      .get('/:id/questions', this.getQuestionsByPoll)
      .post('', this.createPoll)
      .put('/:id', this.editPoll)
      .put('/:id/questions/:questionId', this.editQuestion)
      .delete('/:id', this.deletePoll)
      .delete('/:id/questions/:questionId', this.deleteQuestion)
  }

  async getAllPolls(req, res, next) {
    try {
      const polls = await pollsService.getAllPolls(req.query)
      res.send(polls)
    } catch (error) {
      next(error)
    }
  }

  async getPollById(req, res, next) {
    try {
      const poll = await pollsService.getPollById(req.params.id)
      res.send(poll)
    } catch (error) {
      next(error)
    }
  }

  async getQuestionsByPoll(req, res, next) {
    try {
      const questions = await questionsService.getQuestionsByPoll(req.params.id)
      res.send(questions)
    } catch (error) {
      next(error)
    }
  }

  async getQuestionById(req, res, next) {
    try {
      const questions = await questionsService.getQuestionById(req.params.id, req.params.questionId)
      res.send(questions)
    } catch (error) {
      next(error)
    }
  }

  async createPoll(req, res, next) {
    try {
      req.body.userId = req.userInfo.id
      req.body.id = req.params.id
      const poll = await pollsService.createPoll(req.body)
      res.send(poll)
    } catch (error) {
      next(error)
    }
  }

  // FIXME[epic=PollEditing] editing a poll should no longer edit the original, instead it should create a copy of the master with the new changes
  async editPoll(req, res, next) {
    try {
      req.body.userId = req.userInfo.id
      req.body.id = req.params.id
      const poll = await pollsService.editPoll(req.body)
      res.send(poll)
    } catch (error) {
      next(error)
    }
  }

  async editQuestion(req, res, next) {
    try {
      req.body.userId = req.userInfo.id
      req.body.pollId = req.params.id
      req.body.id = req.params.questionId
      const question = await questionsService.editQuestion(req.body)
      res.send(question)
    } catch (error) {
      next(error)
    }
  }

  async deletePoll(req, res, next) {
    try {
      // NOTE why pass through the creatorId? As long as the logged in user is a staff member, we should allow a delete
      const poll = await pollsService.deletePoll(req.params.id)
      res.send(poll)
    } catch (error) {
      next(error)
    }
  }

  async deleteQuestion(req, res, next) {
    try {
      const question = await questionsService.deleteQuestion(req.params.id, req.params.questionId)
      res.send(question)
    } catch (error) {
      next(error)
    }
  }
}
