<template>
  <div class="text-end">
    <canvas id="resultsChart"></canvas>
    <button
      class="btn btn-success mt-3"
      v-if="routeIndex < activeSession.poll?.questions.length"
      @click="nextQuestion"
    >
      Next Question
    </button>
    <button class="btn btn-danger mt-3" v-else @click="finishPoll">
      Finish Poll
    </button>
  </div>
</template>


<script>
import { computed, onMounted } from "vue"
import { chartService } from '../services/ChartService'
import { logger } from "../utils/Logger"
import { questionsService } from "../services/QuestionsService"
import { useRoute, useRouter } from "vue-router"
import { socketService } from "../services/SocketService"
import { AppState } from "../AppState"
import { pollSessionsService } from "../services/PollSessionsService"
export default {
  props: { answers: { type: Array, required: true }, question: { type: Object, required: true } },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    onMounted(() => {
      logger.log(props.question)
      let ctx = document.getElementById('resultsChart')?.getContext('2d')
      logger.log(ctx)
      if (ctx) {
        let data = { question: props.question, answers: props.answers }
        chartService.drawChart(ctx, data)
      }
    })
    return {
      route,
      router,
      activeSession: computed(() => AppState.activeSession),
      routeIndex: computed(() => parseInt(route.params.index, 10)),
      async nextQuestion() {
        let nextQuestion = parseInt(route.params.index, 10)
        nextQuestion++
        questionsService.toggleChart()
        socketService.nextQuestion(route.params.id, nextQuestion)
      },
      async finishPoll() {
        try {
          await pollSessionsService.finishPollSession()
          router.push({ name: 'ResultsPage' })
        } catch (error) {
          logger.error(error)
        }
      },
    }
  }
}
</script>


<style lang="scss" scoped>
canvas {
  outline: 1px red solid;
  max-height: 65vh;
}
</style>
