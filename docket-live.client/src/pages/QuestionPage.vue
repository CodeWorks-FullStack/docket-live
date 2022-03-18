<template>
  <div class="container-fluid" v-if="activeQuestion.choices">
    <GameNavbar />
    <TopCard v-if="!revealChart" />
    <Chart :question="activeQuestion" :answers="playerAnswers" v-else />
    <BottomCard />
  </div>
</template>


<script>
import { computed, onMounted, onUnmounted, ref, } from "@vue/runtime-core"
import { pollSessionsService } from "../services/PollSessionsService"
import { useRoute } from "vue-router"
import { AppState } from "../AppState"
import { questionsService } from "../services/QuestionsService"
import { answersService } from "../services/AnswersService"

import { logger } from "../utils/Logger"
import { socketService } from "../services/SocketService"
import { AuthService } from "../services/AuthService"
export default {
  setup() {
    const route = useRoute()
    onMounted(async () => {
      try {
        await pollSessionsService.getById(route.params.id)
        await questionsService.setActiveQuestion(route.params.index)
        if (AuthService.hasRoles('staff')) {
          await answersService.queryAnswers(AppState.activeQuestion.id)
        }
        socketService.joinRoom(route.params.id)
      } catch (error) {
        logger.error(error)
      }
    })
    onUnmounted(() => {
      AppState.activeRoom = null
    })
    return {
      revealChart: computed(() => AppState.revealChart),
      activeQuestion: computed(() => AppState.activeQuestion),
      playerAnswers: computed(() => AppState.playerAnswers)

    }
  }
}
</script>


<style lang="scss" scoped>
</style>
