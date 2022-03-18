<template>
  <div>
    <!-- NOTE checking to see if poll prop is a poll session or regular pole -->
    <div v-if="!poll.pollId">
      <QuestionComponent :questions="poll.questions" />
    </div>
    <div v-else>
      <ResultsComponent />
    </div>
  </div>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"
export default {
  props: { poll: { type: Object, required: true } },
  setup(props) {
    return {
      // TODO need to grab answers for the poll that was clicked on, and add the answers to each question that already exists in the appstate.polls

      // need to iterate through pollSessionAnswers
      results: computed(() => {
        let formattedArr = AppState.pollSessionAnswers.map(ps => {
          props.poll.questions.forEach(q => {
            if (ps.questionId == q.id) {
              ps.question = q
            }
          })
          return ps
        })
        return formattedArr
      })
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
