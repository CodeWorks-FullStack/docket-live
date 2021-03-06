import { BadRequest } from '@bcwdev/auth0provider/lib/Errors'
import { dbContext } from '../db/DbContext'

class PollSessionsService {
  async getSessions(query = {}) {
    const sessions = await dbContext.PollSessions.find(query).populate('poll')
    return sessions
  }

  async getPollSessionById(id) {
    const session = await dbContext.PollSessions.findOne({ _id: id }).populate('poll').populate('currentPlayers')
    if (!session) {
      throw new BadRequest('No Session Found')
    }
    return session
  }

  async createSession(body) {
    const session = await dbContext.PollSessions.create(body)
    if (!session) {
      throw new BadRequest('Could Not Create Session')
    }
    await session.populate('poll')
    return session
  }

  async editPollSession(body) {
    const session = await this.getPollSessionById(body.id)
    body.userId = session.userId
    body.className = body.className == null ? session.className : body.className
    body.isActive = body.isActive == null ? session.isActive : body.isActive
    body.isLive = body.isLive == null ? session.isLive : body.isLive
    const updated = await dbContext.PollSessions.findOneAndUpdate({ _id: session.id }, body, { new: true })
    if (!updated) {
      throw new BadRequest('Unable To Edit')
    }
    return updated
  }

  async joinPollSession(code, userId) {
    const session = await dbContext.PollSessions.findOne({ sessionCode: code })
    if (session.players.includes(userId.toString())) {
      return session
    } else {
      session.players.push(userId)
      await session.save()
      return session
    }
  }

  async deletePollSession(id) {
    const session = await this.getPollSessionById(id)
    await dbContext.PollSessions.findOneAndDelete({ _id: session.id })
    return 'Session canceled'
  }
}

export const pollSessionsService = new PollSessionsService()
