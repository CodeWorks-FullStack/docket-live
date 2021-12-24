import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"


class QuestionsService {


  async setActiveQuestion(index){
    let num = Number(index)
    AppState.activeQuestion = AppState.activeSession.poll?.questions[num]
    logger.log(AppState.activeQuestion)
  }
async addQuestion(newQuestion){
  const res = await api.post('api/questions', newQuestion)
  logger.log(res.data)
  const index = AppState.polls.findIndex(p => p.id === newQuestion.pollId)
  AppState.polls.splice(index, 1, res.data)
}

async deleteQuestion(pollId, id){
  const res = await api.delete('api/polls/' + pollId + '/questions/' + id)
  logger.log(res.data)
 const found = AppState.polls.find(p => p.id == pollId)
 found.questions = found.questions.filter(q => q.id !== id)
}
}


export const questionsService = new QuestionsService()
