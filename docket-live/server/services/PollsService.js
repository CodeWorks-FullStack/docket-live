
import { dbContext } from '../db/DbContext'
import { BadRequest } from '../utils/Errors'

// TODO refactor this code a little - use mongoose methods

class PollsService {
  async getAllPolls(query = {}) {
    const polls = await dbContext.Polls.find(query)
    // TODO check role to return all polls
    return polls
  }

  async getPollById(id) {
    const poll = await dbContext.Polls.findOne({ _id: id })
    if (!poll) {
      throw new BadRequest('Invalid Id')
    }
    return poll
  }

  async createPoll(body) {
    const poll = await dbContext.Polls.create(body)
    if (!poll) {
      throw new BadRequest('Could not create')
    }
    return poll
  }

  // FIXME[epic=PollEditing] editing a poll should no longer edit the original, instead it should create a copy of the master with the new changes
  async editPoll(body) {
    const orignalPoll = await this.getPollById(body.id)

    const edited = await dbContext.Polls.findOneAndUpdate({ _id: orignalPoll.id }, body, { new: true })
    if (!edited) {
      throw new BadRequest('Could Not Edit')
    }
    return edited
  }

  async deletePoll(id) {
    const pollToDelete = await this.getPollById(id)
    await pollToDelete.remove()
    return pollToDelete
  }
}

export const pollsService = new PollsService()
