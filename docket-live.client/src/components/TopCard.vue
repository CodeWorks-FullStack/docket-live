<template>
  <div class="row justify-content-center">
    <div class="col-12 text-center mb-4" v-if="activeSession.poll">
      <p class="title text-light m-0">
        {{ activeSession.poll.title }}
      </p>
      <p class="class text-primary m-0">
        {{ activeSession.className }} - {{ activeSession.poll.week }}
      </p>
    </div>
    <div class="col-md-10">
      <p class="text-warning m-0 question-label">Question {{ routeIndex }}</p>
    </div>
    <div
      class="
        col-md-10
        question-area
        d-flex
        align-items-center
        justify-content-center
      "
    >
      <h1 class="question">{{ activeQuestion.body }}?</h1>
    </div>
    <div class="col-12 text-center" v-if="!isStaff">
      <span class="timer">{{ playerAnswers }}</span>
    </div>
    <div class="col-10 text-end" v-if="isStaff">
      <button class="btn move-on" @click="revealChart">Move on</button>
    </div>
  </div>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
import { socketService } from "../services/SocketService"
import { pollSessionsService } from "../services/PollSessionsService"
import { router } from "../router"
import { useRoute, useRouter } from "vue-router"
import { questionsService } from "../services/QuestionsService"
import { AuthService } from "../services/AuthService"
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    return {
      route,
      router,
      isStaff: computed(() => AuthService.hasRoles('staff')),
      activeSession: computed(() => AppState.activeSession),
      playerAnswers: computed(() => AppState.playerAnswers.length),
      account: computed(() => AppState.account),
      activeQuestion: computed(() => AppState.activeQuestion),
      revealChart() {
        questionsService.toggleChart()
      },
    }
  }
}
</script>


<style lang="scss" scoped>
.title {
  font-size: 36px;
}

.class {
  font-size: 28px;
}

.question-area {
  background: rgba(243, 242, 242, 0.35);
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 5px 0px #d7d7d7;
  backdrop-filter: blur(20px);
  border-radius: 5px;
  height: 40vh;
}

.gradient {
  background: linear-gradient(to right, #e5405e 0%, #ffdb3a 45%, #3fffa2 100%);
  transition: ease;
}

.question-label {
  font-size: 20px;
}

.question {
  //  font-size: 50px;
  color: #ffffff;
  text-shadow: 0px 1px 0px black;
}

.timer {
  background: #abc1cd;
  box-shadow: 0px 4px 0px #7a8f99;
  border-radius: 50%;
  right: 47.4%;
  width: 64px;
  height: 64px;
  position: absolute;
  transform: translateY(-30px);
  z-index: 1000;
  font-size: 36px;
}

.move-on {
  position: absolute;
  right: 10%;
  transform: translateY(-20px);
  background: #3ba5dc;
  box-shadow: 0px 4px 0px #27688c;
  border-radius: 50px;
  color: white;
}

.finish-poll {
  position: absolute;
  right: 10%;
  transform: translateY(-20px);
  background: #ea0606;
  box-shadow: 0px 4px 0px #7d2646;
  border-radius: 50px;
  color: white;
}
</style>
