import { Schema } from 'mongoose'

export const Answer = new Schema({
  pollId: { type: Schema.Types.ObjectId, required: true, ref: 'Poll' },
  pollSessionId: { type: Schema.Types.ObjectId, required: true, ref: 'PollSession' },
  questionId: { type: Schema.Types.ObjectId, required: true, ref: 'Question' },
  playerId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
  answer: { type: Object, required: true }
},
  { timestamps: true, toJSON: { virtuals: true } })

Answer.virtual('player', {
  localField: 'playerId',
  foreignField: '_id',
  justOne: true,
  ref: 'Account'
})

Answer.virtual('poll', {
  localField: 'pollId',
  foreignField: '_id',
  justOne: true,
  ref: 'Poll'

})

Answer.virtual('pollSession', {
  localField: 'pollSessionId',
  foreignField: '_id',
  justOne: true,
  ref: 'PollSession'

})

Answer.virtual('question', {
  localField: 'questionId',
  foreignField: '_id',
  justOne: true,
  ref: 'Question'
})
