<template>
  <Navbar />
  <div class="container">
    <div class="row mt-4 text-center">
      <div class="col-md-2 col-3 bg-light me-md-2 me-1 tab-rounded">
        <router-link class="tab" :to="{ name: 'LivePollsPage' }">
          <p class="">Live polls</p>
        </router-link>
      </div>
      <div class="col-md-2 col-3 bg-light me-md-2 me-1 tab-rounded p-0">
        <router-link class="tab" :to="{ name: 'SurveysPage' }">
          <p>Surveys</p>
        </router-link>
      </div>
      <div class="col-md-2 col-3 bg-light tab-rounded p-0">
        <router-link class="tab" :to="{ name: 'ResultsPage' }">
          <p>Results</p>
        </router-link>
      </div>
    </div>
    <div class="view">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import { computed, onMounted } from "@vue/runtime-core"
import { logger } from "../utils/Logger"
import { pollsService } from '../services/PollsService'
import { AppState } from "../AppState"
import { useRoute } from "vue-router"

export default {
  setup() {
    const route = useRoute()
    onMounted(async () => {
      try {
        await pollsService.getPolls()
      } catch (error) {
        logger.log(error)
      }
    })
    return {
      route,



    }

  }
}
</script>


<style lang="scss" scoped>
.content-height {
  min-height: 75vh;
}

.tab-rounded {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.tab p {
  background-color: #cfdde4;
  height: 100%;
  width: 100%;
  color: black;
}

.router-link-exact-active p {
  background-color: #f3f2f2 !important;
  color: #3ba5dc !important;
}

.search {
  background: #e9ebec;
  box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}
</style>
