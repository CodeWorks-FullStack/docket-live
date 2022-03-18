<template>
  <div class="row my-2" v-if="isStaff">
    <div class="col-md-6 col-4 d-flex align-items-center"></div>

    <div class="col-md-6 col-8 d-flex align-items-center justify-content-end">
      <button
        class="btn nav-btn me-5 w-25 d-none d-md-block"
        @click="cancelPollSession"
      >
        Cancel Poll
      </button>
      <button
        class="btn nav-btn me-5 w-50 d-block d-md-none"
        @click="cancelPollSession"
      >
        Cancel Poll
      </button>
      <i
        class="mdi mdi-music-note-eighth nav-icon mdi-36px"
        @click="toggleAudio"
        v-if="!muted"
      ></i>
      <i
        class="mdi mdi-volume-mute nav-icon mdi-36px"
        @click="toggleAudio"
        v-else
      ></i>
      <audio loop id="theme">
        <source src="../assets/audio/Docket-live-theme.mp3" />
      </audio>
    </div>
  </div>
</template>


<script>
import { computed, onMounted, ref } from "@vue/runtime-core"
import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { pollSessionsService } from "../services/PollSessionsService"
import { router } from "../router"
import Pop from "../utils/Pop"
import { AuthService } from "../services/AuthService"
export default {
  setup() {
    const muted = ref(true)
    return {
      muted,
      account: computed(() => AppState.account),
      isStaff: computed(() => AuthService.hasRoles('staff')),
      toggleAudio() {
        muted.value = !muted.value
        const music = document.getElementById('theme')
        muted.value ? music.pause() : music.play()
      },
      async cancelPollSession() {
        try {
          if (await Pop.confirm('Are you sure? this will cancel the current poll')) {
            await pollSessionsService.cancelPollSession()
            router.push({ name: "LivePollsPage" })
          }
        } catch (error) {
          logger.error(error)
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.nav-icon {
  color: #abc1cd;
}

.nav-btn {
  border: 2px solid #abc1cd;
  box-sizing: border-box;
  border-radius: 50px;
  color: #abc1cd;
}
</style>
