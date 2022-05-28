<template>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <div>
                <h1>Top page</h1>
                <p v-if="user">Your e-mail is {{ user.email }}</p>
              </div>
            </v-sheet>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <!--  -->
            </v-sheet>
          </v-col>
        </v-row>
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