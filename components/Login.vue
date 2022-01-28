<template>
  <v-app fluid>
    <v-container fluid fill-height>
        <Notification :message="error" v-if="error" />
        <v-layout column align-center justify-center>
            <v-img
            src="/img/logo.png"
            max-width="250"
            class="mb-10"
            ></v-img>
            <v-flex xs12 sm8 md12>
              <v-card elevation="3" width="500" height="500">
                  <v-toolbar dark color="#038e91">
                    <v-toolbar-title>로그인</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                    <v-form ref="form">
                        <v-text-field
                          name="email"
                          label="email"
                          :rules="emailRules"
                          type="text"
                          v-model="email"
                        ></v-text-field>
                        <v-text-field
                          id="password"
                          name="password"
                          label="password"
                          type="password"
                          v-model="password"
                        ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-spacer></v-spacer>
                  <v-card-actions>
                    <v-btn color="primary" @click="login" width="100%" height="50">로그인</v-btn>
                  </v-card-actions>
              </v-card>
            </v-flex>
        </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
   auth: 'guest',
   name: 'Login',
   data() {
     return {
      email : '',
      emailRules: [
        v => !!v || '이메일을 입력해주세요.',
        v => /.+@.+\..+/.test(v) || '이메일 형식이 다릅니다.',
      ],
      password : '',
      error: null,
     }
   },
   methods: {
    async login() {
      if(this.$refs.form.validate()) {
        try {
          let response = await this.$auth.loginWith('laravelSanctum', {
            data: {
              email: this.email,
              password : this.password,
            }
          })
          this.$router.push('/')
        } catch (e) {
          // this.error = e.response.data.message
          this.$toast.error('아이디가 없거나, 비밀번호가 다릅니다.');
        }
      }
    }
  }
};
</script>

<style scope>
#logo { margin-bottom:30px; }
</style>
