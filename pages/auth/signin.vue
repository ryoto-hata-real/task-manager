<template>
  <v-main>
    <v-container>
      <v-card 
        class="mx-auto my-12"
        max-width="456"
      >
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-row align="center">
          <v-card-title>
            ログイン
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>

              <button id="googleSignIn" class="btn btn-block" @click="signInWithGoogle">ログイン
              </button>
          </v-card-text>
        </v-row>
        
      </v-card>
    </v-container>
  </v-main>
</template>

<script>

export default {
  layout: 'layout',
  data() {
    return {
      snackbar: false,
      snackbarText: 'エラーはありません',
      auth: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signInWithGoogle() {
      const provider = new this.$fireModule.default.auth.GoogleAuthProvider();
      await this.$fire.auth.signInWithPopup(provider).then(res => {
  
        res.user.getIdToken(true).then(idToken => {
          localStorage.setItem('access_token', idToken.toString())
          localStorage.setItem('refresh_token', res.user.refreshToken.toString())
        })
        
      }).then(async (user) => {
        $nuxt.$router.push('/')
      })
      
      console.log('成功しました')
    },
  }
}

</script>

<style>
.btn-block {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>