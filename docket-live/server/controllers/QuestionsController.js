import { Auth0Provider } from '@bcwdev/auth0provider'
import { answersService } from '../services/AnswersService'
import { questionsService } from '../services/QuestionsService'
import BaseController from '../utils/BaseController'
import { checkRole } from '../utils/CheckRole'

export class QuestionsController extends BaseController {
  constructor() {
    super('api/questions')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('/:id/answers', this.getAnswersByQuestionId)
      .use(checkRole)
      .post('', this.createQuestion)
  }

  async getAnswersByQuestionId(req, res, next) {
    try {
      const answers = await answersService.getByQuestionId(req.params.id)
      res.send(answers)
    } catch (error) {
      next(error)
    }
  }

  async createQuestion(req, res, next) {
    try {
      req.body.userId = req.userInfo.id
      const question = await questionsService.create(req.body)
      res.send(question)
    } catch (error) {
      next(error)
    }
  }
}
