import { AppState } from "../AppState"
import { PollSession } from "../models/PollSession"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"

class PollSessionsService {

  async getById(id) {
    const res = await api.get('api/pollSessions/' + id)
    AppState.activeSession = res.data
    return res.data
  }

  async getResults() {
    const res = await api.get('api/pollSessions')
    logger.log('get results res', res.data)
    AppState.polls = res.data.map(s => new PollSession(s))
    // TODO refactor appstate to separate polls vs pollSessions
    logger.log(AppState.polls)
  }

  async getAnswersByPollSession(pollSessionId) {
    const res = await api.get('api/pollSessions/' + pollSessionId + '/answers')
    logger.log('answers by poll session', res.data)
    let q = {}
    res.data.forEach(a => {
      q[a.questionId] = a[a.questionId] || []
      q[a.questionId].push(a)
    })
    AppState.pollSessionAnswers = q
  }

  async createPollSession(newPollSession) {
    const res = await api.post('api/pollSessions', newPollSession)
    logger.log(res.data)
    AppState.activeSession = res.data
    return res.data.id
  }

  async joinPoll(code) {
    const res = await api.put('api/pollSessions/' + code + '/join')
    AppState.activeSession = res.data
    return res.data.id
  }

  async finishPollSession() {
    const sessionEnding = AppState.activeSession
    sessionEnding.isLive = false
    await api.put('api/pollSessions/' + sessionEnding.id, sessionEnding)
  }


  async cancelPollSession() {
    const session = AppState.activeSession
    await api.delete('api/pollSessions/' + session.id)
  }
}

export const pollSessionsService = new PollSessionsService()
