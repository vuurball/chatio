<template>
  <header class="masthead bg-primary text-white text-center">
    <div class="container d-flex align-items-center flex-column">
      <img class="masthead-avatar mb-5" src="img/avataaars.svg" alt />
      <h1 class="masthead-heading text-uppercase mb-0">Start Chating</h1>
      <div class="divider-custom divider-light">
        <div class="divider-custom-line"></div>
        <div class="divider-custom-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="divider-custom-line"></div>
      </div>

      <form @submit.prevent="joinChat">
        <div class="control-group">
          <div class="form-group floating-label-form-group controls mb-0 pb-2">
            <input
              v-model="username"
              class="form-control"
              type="text"
              placeholder="What's your name?"
              autocomplete="off"
              required="required"
            />
          </div>
        </div>
        <br />
        <div class="form-group">
          <button type="submit" class="btn btn-warning btn-xl">Join</button>
        </div>
      </form>
    </div>
  </header>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "login-section",
  data() {
    return {
      username: ""
    };
  },
  methods: {
    //including vuex action methods
    ...mapActions(["loginAs"]),
    joinChat() {
      //save username in store
      this.loginAs(this.username);
      //redirect to /chat page
      this.$router.push("chat");
    }
  }
};
</script>
