<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6">
        <Notification :message="error" v-if="error" />
        <v-form
          ref="form"
        >
          <v-text-field
            v-model="form.name"
            :counter="10"
            label="이름"
            color="green"
            :rules="nameRules"
            required
          >
          </v-text-field>

          <v-text-field
            v-model="form.email"
            :counter="30"
            label="이메일"
            :rules="emailRules"
            color="green"
            required
          >
          </v-text-field>

          <v-text-field
            v-model="form.password"
            label="비밀번호"
            type="password"
            :rules="passwordRules"
            color="green"
            required
          >
          </v-text-field>

          <v-text-field
            v-model="form.password_confirmation"
            label="비밀번호확인"
            type="password"
            :rules="passwordRules2"
            color="green"
            required
          >
          </v-text-field>

          <v-btn color="blue-grey" class="ml-0" @click="register">
            회원가입
          </v-btn>
        </v-form>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {

  name: 'Register',
  data () {
    return {
      nameRules: [
        v => !!v || '이름을 입력해주세요.',
        v => (v && v.length <= 10) || '이름은 최대 10자 까지 가능합니다.',
      ],
      emailRules: [
        v => !!v || '이메일을 입력해주세요.',
        v => /.+@.+\..+/.test(v) || '이메일 형식이 다릅니다.',
      ],
      passwordRules: [
        v => !!v || '비밀번호를 입력해주세요.',
      ],
      passwordRules2: [
        v => !!v || '비밀번호 확인을 입력해주세요.',
      ],
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      error: null,
    }
  },
  methods: {
    async register () {
      if(this.$refs.form.validate()) {
        try {
          await this.$axios.$post('register', this.form)
          await this.$auth.loginWith('laravelSanctum', {
            data: {
              email: this.form.email,
              password: this.form.password
            },
          })
          this.$router.push('/')
        } catch (e) {
          this.$toast.error(e.response.data.message);
        }
      }
    }
  },
}
</script>
