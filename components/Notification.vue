<template>
<v-alert type="error" v-if="alert">
  {{ message }}
</v-alert>
</template>

<script>
export default {
  name: 'Notification',
  data () {
    return {
      alert: true,
    }
  },
  props: ['message'],
  methods: {
    hide_alert: function (event) {
      console.log('Hide')
      // `event` is the native DOM event
      window.setInterval(() => {
        this.alert = false;
        console.log("hide alert after 3 seconds");
      }, 1000)
    }
  },
  mounted: function () {
    if(alert){
      this.hide_alert();
    }
  }
}
</script>
