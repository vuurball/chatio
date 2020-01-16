<template>
  <div class="container">
    <section class="page-section bg-primary text-white mb-0" id="chat">
      <div class="container">
        <h2 class="page-section-heading text-center text-uppercase text-white">Users</h2>

        <!-- Icon Divider -->
        <div class="divider-custom divider-light">
          <div class="divider-custom-line"></div>
          <div class="divider-custom-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="divider-custom-line"></div>
        </div>
        <p class="masthead-subheading font-weight-light mb-0">{{ onlineUsers.length }} users online</p>

        <!-- Users List -->
        <div class="row">
          <div v-for="(user, i) in onlineUsers" :key="i" class="divider-custom divider-light m-2">
            <div class="divider-custom-icon">
              <p class="masthead-subheading font-weight-light mb-0">{{ user }}</p>
            </div>
          </div>
        </div>
        <!-- /.row -->
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ChatSideBar",
  data() {
    return {
      onlineUsers: []
    };
  },
  methods: {
    ...mapGetters(["getLoggedUsername"])
  },
  sockets: {
    onlineUsers: function(onlineUsersMap) {
      console.log(onlineUsersMap);
      this.onlineUsers = onlineUsersMap;
    }
  },
  created() {
    let username = this.getLoggedUsername();
    if (username) {
      this.$socket.emit("join", username);
    } else {
      //redirect to /chat page
      this.$router.push("/");
    }
  }
};
</script>

