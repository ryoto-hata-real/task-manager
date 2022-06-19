<template>
    <v-main class="grey lighten-2">
      <v-container>
            <DoingTaskList />
      </v-container>
    </v-main>

</template>

<script>
export default {
  layout: "default",
  name: "index",
  middleware: "auth",
  data() {
    return {
      user: null
    }
  },
  mounted() {
    this.user = this.$store.state.user
  },
}
</script>