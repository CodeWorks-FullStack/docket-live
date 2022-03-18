import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  account: {},
  polls: [],
  activeSession: {},
  activeQuestion: {},
  activeAnswer: null,
  playerAnswers: [],
  activeRoom: null,
  fakeData: [],
  revealChart: false,
  pollSessionAnswers: {}
})
