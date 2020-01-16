<template>
  <div class="home">
    <LoginSection />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginSection from "@/components/LoginSection.vue";

export default {
  name: "home",
  components: {
    LoginSection
  },
  data() {
    return {
      isLoggedIn: false,
      loggedUsername: ""
      // this.$router.push('Home')
    };
  }
};
</script>
