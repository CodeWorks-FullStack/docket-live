<template>
  <div class="col-11 mt-4 p-0">
    <div
      class="
        bg-light
        w-100
        collapse-trigger
        row
        align-items-center
        selectable
        no-select
      "
    >
      <div
        class="col-3"
        data-bs-toggle="collapse"
        :data-bs-target="'#collapse-' + poll.id"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        <p class="m-0">
          <b>{{ poll.title }}</b>
        </p>
        <p class="m-0 text-primary" v-if="!poll.className">{{ poll.week }}</p>
        <p class="m-0 text-primary" v-else>{{ poll.className }}</p>
      </div>
      <div
        class="col-6 text-center"
        data-bs-toggle="collapse"
        :data-bs-target="'#collapse-' + poll.id"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        <p class="m-0">
          <b>{{ poll.questions?.length }} Questions</b>
        </p>
        <p class="m-0">Last Edited: {{ formatDate(poll.updatedAt) }}</p>
      </div>
      <div
        class="
          col-md-1 col-3
          offset-md-2
          bg-success
          h-100
          d-flex
          align-items-center
          justify-content-center
        "
        title="Go Live"
        @click.stop="createPollSession"
        v-if="!poll.pollId"
      >
        <i class="mdi mdi-tray-arrow-up icon"></i>
      </div>
      <div
        class="
          col-md-1 col-3
          offset-md-2
          bg-primary
          h-100
          d-flex
          align-items-center
          justify-content-center
        "
        title="View Results"
        v-else-if="!poll.isLive"
      >
        <i class="mdi mdi-eye icon"></i>
      </div>
      <div
        class="
          col-md-1 col-3
          offset-md-2
          bg-warning
          h-100
          d-flex
          align-items-center
          justify-content-center
        "
        title="End Session"
        v-else
      >
        <i class="mdi mdi-tray-arrow-up icon"></i>
      </div>
    </div>
    <div class="row w-100">
      <div class="collapse p-0" :id="'collapse-' + poll.id" @click.stop>
        <div
          class="card card-body reveal container-fluid position-relative"
          :class="{ dotted: editable }"
        >
          <div v-if="editable">
            <EditPollComponent :poll="poll" />
            <div class="text-end position-absolute spill">
              <span class="edit bg-success p-3 mx-2" @click="editPoll">
                Save
                <i
                  class="mdi mdi-content-save"
                  title="confirm edit poll"
                  @click="edit"
                ></i>
              </span>
              <i
                class="mdi mdi-cancel edit bg-warning p-3 mx-3"
                title="cancel edit"
                @click="toggleEdit"
              ></i>
            </div>
          </div>
          <div v-else>
            <PollDetailsComponent :poll="poll" />
            <div class="text-end position-absolute spill">
              <i
                class="mdi mdi-pencil edit bg-primary p-2 mx-2"
                title="edit poll"
                @click="toggleEdit"
              ></i>
              <i
                class="mdi mdi-delete edit bg-danger p-2 mx-3"
                title="delete poll"
                @click="deletePoll"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from "@vue/reactivity"
import Pop from "../utils/Pop"
import { logger } from "../utils/Logger"
import { pollSessionsService } from '../services/PollSessionsService'
import { router } from "../router"
import { pollsService } from "../services/PollsService"
export default {
  props: { poll: { type: Object, required: true } },
  setup(props) {
    const editable = ref(false)
    return {
      editable,
      formatDate(date) {
        if (date) {
          const formatted = new Date(date).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          return formatted
        }
        return "Never edited"
      },
      async toggleEdit() {
        if (editable.value) {
          if (await Pop.confirm('Are You Sure?', 'Your edits will be lost', 'warning', 'Yes remove edits')) {
            editable.value = !editable.value
          }
        } else {
          editable.value = !editable.value
        }
        console.log("edit enabled", editable.value);
      },
      async createPollSession() {
        try {
          const newPollSession = {}
          newPollSession.title = props.poll.title
          newPollSession.className = await Pop.createPollSession()
          newPollSession.isLive = true
          newPollSession.pollId = props.poll.id
          const pollSessionId = await pollSessionsService.createPollSession(newPollSession)
          router.push({ name: 'StartLivePollPage', params: { id: pollSessionId } })
        } catch (error) {
          Pop.toast(error.message, 'error')
          logger.error(error)
        }
      },
      async editPoll() {
        try {
          if (await Pop.confirm()) {
            editable.value = !editable.value
            await pollsService.editPoll(props.poll)
          }
        } catch (error) {
          Pop.toast(error.message, 'error')
          logger.error(error)
        }
      },
      async deletePoll() {
        try {
          if (await Pop.confirm()) {
            await pollsService.deletePoll(props.poll.id)
          }
          Pop.toast('Poll Deleted!', 'success')
        } catch (error) {
          Pop.toast(error.message, 'error')
          logger.error(error)
        }
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.collapse-trigger {
  border: 2px solid #abc1cd;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 5px;
  height: 12vh;
}

.icon {
  font-size: 30px;
}

.dotted {
  border: 3.5px dashed #3ba5dc;
  border-top: 0;
}

.edit {
  border-radius: 45px;
  height: 25px;
  width: 25px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.spill {
  transform: translateY(10px);
  right: 0;
  bottom: 0;
}

.collapse {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0px 0px 5px 5px;
}

.reveal {
  background: #dbe3e8;
  min-height: 15vh;
}
</style>
