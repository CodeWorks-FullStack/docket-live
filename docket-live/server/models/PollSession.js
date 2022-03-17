
import { Schema } from 'mongoose'

export const PollSession = new Schema({
  pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  className: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  isLive: { type: Boolean, default: false },
  sessionCode: { type: String },
  type: { type: String, enum: ['livePoll', 'survey'], default: 'livePoll' },
  players: [{ type: Schema.Types.ObjectId, ref: 'Account' }]
}, { timestamps: true, toJSON: { virtuals: true } })

PollSession.virtual('poll', {
  localField: 'pollId',
  foreignField: '_id',
  justOne: true,
  ref: 'Poll'

})

PollSession.virtual('currentPlayers', {
  localField: 'players',
  ref: 'Account',
  foreignField: '_id',
  justOne: false
})

PollSession.virtual('creator', {
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  ref: 'Profile'
})
