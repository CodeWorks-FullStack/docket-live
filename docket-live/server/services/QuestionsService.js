import { dbContext } from '../db/DbContext'
import { pollsService } from './PollsService'

class QuestionsService {
  async getQuestionById(pollId, questionId) {
    const poll = await dbContext.Polls.find({ _id: pollId, 'questions._id': questionId }, { 'questions.$': 1, _id: questionId })

    return poll[0]
  }

  async getQuestionsByPoll(pollId) {
    const questions = await dbContext.Questions.find({ pollId: pollId })
    return questions
  }

  async create(body) {
    const poll = await pollsService.getPollById(body.pollId)
    poll.questions.push(body)
    poll.save()
    return poll
  }

  async editQuestion(updatedQuestion) {
    const poll = await pollsService.getPollById(updatedQuestion.pollId)
    const question = poll.questions.find(q => q.id === updatedQuestion.id)
    question.body = updatedQuestion.body == null ? question.body : updatedQuestion.body
    question.choices = updatedQuestion.choices == null ? question.choices : updatedQuestion.choices

    poll.save()
    return poll
  }

  async deleteQuestion(pollId, questionId) {
    const question = await this.getQuestionById(pollId, questionId)
    await dbContext.Polls.updateMany({
      _id: pollId
    },
      {
        $pull: {
          questions: {
            _id: questionId
          }
        }
      })
    return question
  }
}

export const questionsService = new QuestionsService()
