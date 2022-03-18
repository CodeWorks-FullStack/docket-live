<template>
  <div class="container-fluid">
    <GameNavbar />
    <div class="row text-center">
      <div class="col-12" v-if="activeSession.poll">
        <h1 class="title-shadow">{{ activeSession.poll.title }}</h1>
        <h2 class="class-shadow">
          {{ activeSession.className }} - {{ activeSession.poll.week }}
        </h2>
        <h2 class="code-shadow">Join Code: {{ activeSession.sessionCode }}</h2>
      </div>
    </div>
    <div class="row justify-content-center mt-md-0 mt-3">
      <div class="col-3">
        <p class="text-warning m-0">Who's All Here?</p>
      </div>
      <div class="col-4 d-flex justify-content-center" v-if="isStaff">
        <button class="btn start-poll ms-2" @click="startPoll">
          Start Poll
        </button>
      </div>
      <div class="col-4" v-else></div>
      <div class="col-3 text-end">
        <span class="join-timer p-3 text-center">{{
          activeSession.currentPlayers?.length
        }}</span>
      </div>
      <div class="col-10 player-area">
        <div class="row my-4">
          <div
            class="col-md-6 col-lg-3 col-12 p-2"
            v-for="(p, index) in activeSession.currentPlayers"
            :key="index"
          >
            <!-- FIXME name text spilles out of bubble if name is too long -->
            <div
              class="player-bubble p-1"
              :class="{
                'animate__animated animate__tada': isStaff,
              }"
              :style="{ 'background-color': colors[index % 5] }"
            >
              <p class="m-2">
                <img :src="p.picture" class="profile-pic" alt="" />
                {{ p.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
import { onMounted } from "@vue/runtime-core"
import { logger } from "../utils/Logger"
import { pollSessionsService } from "../services/PollSessionsService"
import { useRoute } from "vue-router"
import { socketService } from "../services/SocketService"
import 'animate.css';
import { AuthService } from "../services/AuthService"
export default {
  setup() {
    const route = useRoute()
    const colors = ["#EAD35D", "#EA5D5D", "#EA5DB1", "#86E29B", "#3BA5DC"]
    onMounted(async () => {
      try {
        await pollSessionsService.getById(route.params.id)
        socketService.joinRoom(route.params.id)
      } catch (error) {
        logger.error(error)
      }
    })
    return {
      colors,
      route,
      isStaff: computed(() => AuthService.hasRoles('staff')),
      account: computed(() => AppState.account),
      activeSession: computed(() => AppState.activeSession),
      async startPoll() {
        socketService.nextQuestion(route.params.id, 1)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.title-shadow {
  font-size: 75px;
  color: #ffffff;
  text-shadow: 0px 4px 0px #abc1cd;
}

.profile-pic {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.class-shadow {
  color: #3ba5dc;
  text-shadow: 0px 4px 0px #196895;
  font-size: 40px;
}

.code-shadow {
  color: #ead35d;
  text-shadow: 0px 1px 0px #eaa95d;
  font-size: 40px;
}
.player-area {
  background: rgba(243, 242, 242, 0.25);
  border: 1px solid #f5f5f5;
  box-sizing: border-box;
  box-shadow: 0px 5px 0px #d7d7d7;
  backdrop-filter: blur(20px);
  border-radius: 5px;
  height: 55vh;
  overflow-y: auto;
}

.start-poll {
  background: #86e29b;
  box-shadow: 0px 4px 0px #57a480;
  border-radius: 50px;
  position: absolute;
  transform: translateY(5px);
  z-index: 1000;
  width: 250px;
}

.start-timer {
  background: #3ba5dc;
  box-shadow: 0px 4px 0px #196895;
  border-radius: 50px;
  position: absolute;
  transform: translateY(5px);
  z-index: 1000;
  width: 250px;
}

.join-timer {
  background: #86e29b;
  box-shadow: 0px 4px 0px #57a480;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  position: absolute;
  transform: translateY(-4px);
  z-index: 1000;
  right: 7%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.player-bubble {
  border-radius: 50px;
}
</style>
