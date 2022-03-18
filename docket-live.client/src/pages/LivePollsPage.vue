<template>
  <div class="row justify-content-start content-height mb-4">
    <!-- TODO need to fix styling for upper left hand corner of card -->
    <div class="col-12 bg-light rounded">
      <div class="row mt-4">
        <div class="col-md-6">
          <input
            type="text"
            placeholder="search..."
            class="search w-100 ms-md-4"
            v-model="searchQuery"
          />
        </div>
        <div class="col-6 text-end">
          <button
            class="btn btn-outline-dark"
            data-bs-toggle="modal"
            data-bs-target="#createPoll"
          >
            Create Poll
          </button>
        </div>
      </div>
      <div class="row justify-content-center pb-4">
        <PollComponent v-for="p in polls" :key="p.id" :poll="p" class="" />
      </div>
    </div>
    <Modal id="createPoll">
      <template #modal-title>
        <h5>Create Poll</h5>
      </template>
      <template #modal-body>
        <input
          class="w-100"
          type="text"
          placeholder="Title..."
          v-model="editable.title"
        />
        <input
          class="w-100 mt-4"
          type="text"
          placeholder="Week..."
          v-model="editable.week"
        />
        <button class="btn btn-success mt-4" @click="createPoll">Create</button>
      </template>
    </Modal>
  </div>
</template>


<script>
import { computed, ref } from "@vue/reactivity"
import { pollsService } from "../services/PollsService"
import { onMounted } from "@vue/runtime-core"
import { AppState } from "../AppState"
import { logger } from "../utils/Logger"
import { Modal } from "bootstrap"
import Pop from "../utils/Pop"
export default {
  setup() {
    const editable = ref({})
    const searchQuery = ref('')
    onMounted(async () => {
      try {
        await pollsService.getPolls()
      } catch (error) {
        logger.log(error)
      }
    })
    return {
      editable,
      searchQuery,
      polls: computed(() => AppState.polls),
      async createPoll() {
        try {
          if (editable.value.title && editable.value.week) {
            await pollsService.createPoll(editable.value)
          }
          editable.value = {}
          Pop.toast('Poll Created!', 'success')
          Modal.getOrCreateInstance(document.getElementById('createPoll')).hide()
        } catch (error) {
          logger.error(error)
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
