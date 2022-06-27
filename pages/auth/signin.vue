<template>
  <v-main>
    <v-container>
      <v-card 
        class="mx-auto"
        max-width="640"
      >
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
          <v-card-title>
            Googleアカウントでログイン
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            google fire authというサービスを利用して認証を行なっております。
            また、メールアドレスに営業等のあらゆるメールをお送りすることは一切ございません。
          </v-card-text>
          <div class="google-btn"> 
            <img src="/btn_google_signin_light_normal_web@2x.png" @click="signInWithGoogle">      
          </div>  
      </v-card>
    </v-container>
  </v-main>
</template>

<script>

export default {
  layout: 'layout',
  middleware: "auth",
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
        
      })
      $nuxt.$router.push('/')
      
      
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

.google-btn {
  margin-right:auto;
  margin-left:auto;
  width: 40%;
  background: transparent;
}

.google-btn img{
  width: 100%;
}

.google-btn img:hover {
  cursor: pointer;
  box-shadow: 0px 10px 10px rgba(151, 151, 151, 0.445);
  transition: 300ms;
}
</style>