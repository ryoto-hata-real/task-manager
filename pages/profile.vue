<template>
  <v-main class="grey lighten-3">
    <v-container>
      <h1>User Profile</h1>
      <div v-if="user">Your e-mail is {{ user.email }}</div>
      <button @click="logout">Logout</button>
    </v-container>
  </v-main>

</template>

<script>
export default {
  layout: "default",
  name: "profile",
  middleware: "auth",
  data() {
    return {
      user: null
    }
  },
  mounted() {
    this.user = this.$store.state.user
  },
  methods: {
    async logout() {
      await this.$fire.auth.signOut()
    },
  }
}
</script>