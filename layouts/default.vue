<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="white"
      flat
    >
      <v-tabs
        centered
        class="ml-n9"
        color="grey darken-1"
      >
        <v-tab
          v-for="link in links"
          :key="link"
          :to="link"
        >
          {{ link }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <Nuxt />
    
  </v-app>


</template>

<script>
export default {
  middleware: "redirectTop",
  data() {
    return {
      links: [
        'top',
        'profile',
      ],
    }
  },
  
}
</script>

<style scoped>
.global-link{
  text-decoration: none;
  color:rgba(0, 0, 0, 0.54);
}
</style>
