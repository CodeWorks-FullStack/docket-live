<template>
  <div>
    <!-- NOTE checking to see if poll prop is a poll session or regular pole -->
    <div v-if="!poll.pollId">
      <QuestionComponent :questions="poll.questions" />
    </div>
    <div v-else>
      <ResultsComponent v-for="a in answers" :key="a.id" :answer="a" />
    </div>
  </div>
</template>


<script>
import { computed } from "@vue/reactivity"
import { AppState } from "../AppState"


export default {
  props: { poll: { type: Object, required: true } },
  setup() {
    return {
      answers: computed(() => AppState.pollSessionAnswers)
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
