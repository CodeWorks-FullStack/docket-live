import { Auth0Provider } from '@bcwdev/auth0provider'
import { answersService } from '../services/AnswersService'
import { pollSessionsService } from '../services/PollSessionsService'
import BaseController from '../utils/BaseController'
import { checkRole } from '../utils/CheckRole'

export class PollSessionsController extends BaseController {
  constructor() {
    super('api/pollSessions')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getPollSessions)
      .get('/:id', this.getPollSessionById)
      .put('/:code', this.joinPollSession)
      .use(checkRole)
      .get('/:id/answers', this.getAnswersByPollSession)
      .post('', this.createPollSession)
      .put('/:id', this.editPollSession)
  }

  async getPollSessions(req, res, next) {
    try {
      const sessions = await pollSessionsService.getSessions(req.query)
      res.send(sessions)
    } catch (error) {
      next(error)
    }
  }

  async getPollSessionById(req, res, next) {
    try {
      const session = await pollSessionsService.getPollSessionById(req.params.id)
      res.send(session)
    } catch (error) {
      next(error)
    }
  }

  async getAnswersByPollSession(req, res, next) {
    try {
      const answers = await answersService.getByPollSessionId(req.params.id)
      res.sed(answers)
    } catch (error) {
      next(error)
    }
  }

  async joinPollSession(req, res, next) {
    try {
      res.send(await pollSessionsService.joinPollSession(req.params.code, req.userInfo.id))
    } catch (error) {
      next(error)
    }
  }

  async createPollSession(req, res, next) {
    try {
      req.body.userId = req.userInfo.id
      const session = await pollSessionsService.createSession(req.body)
      res.send(session)
    } catch (error) {
      next(error)
    }
  }

  async editPollSession(req, res, next) {
    try {
      req.body.id = req.params.id
      const session = await pollSessionsService.editPollSession(req.body)
      res.send(session)
    } catch (error) {
      next(error)
    }
  }
}
