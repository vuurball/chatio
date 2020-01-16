<template>
  <div class="container">
    <div class="row">
      <ChatMessage v-for="(msg, i) in chatMessages" :key="i" v-bind:msg="msg" />
    </div>

    <!-- Chat Form -->
    <div class="row">
      <div class="col-lg-8">
        <div>{{ this.userIsTyping }}</div>
        <form @submit.prevent="sendMessage" class="form-inline">
          <div class="form-group mb-2 col-6">
            <input
              @keyup="userTyping"
              v-model="chatInput"
              class="form-control-lg col-12 bg-light"
              type="text"
              placeholder="Say something"
              autocomplete="off"
              required="required"
            />
          </div>
          <button type="submit" class="btn btn-primary btn-xl">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/ChatMessage.vue";

export default {
  name: "ChatWindow",
  components: {
    ChatMessage
  },
  data() {
    return {
      chatInput: "",
      userIsTyping: "",
      typingNotificationThrottle: true,
      chatMessages: []
    };
  },
  methods: {
    sendMessage() {
      this.chatMessages.push({
        username: "",
        message: this.chatInput,
        bgColor: "badge-success",
        isNotification: false,
        floatSide: "float-right"
      });
      this.$socket.emit("chatMessage", this.chatInput);
      this.chatInput = "";
    },
    userTyping() {
      if (this.typingNotificationThrottle) {
        this.$socket.emit("userTyping");
        this.typingNotificationThrottle = false;
        setTimeout(() => {
          this.typingNotificationThrottle = true;
        }, 2000);
      }
    }
  },
  sockets: {
    left: function(userName) {
      if (userName) {
        this.chatMessages.push({
          username: "",
          message: userName + " has left",
          bgColor: "",
          isNotification: true,
          floatSide: ""
        });
      }
    },
    joined: function(userName) {
      this.chatMessages.push({
        username: "",
        message: userName + " has joined",
        bgColor: "",
        isNotification: true,
        floatSide: ""
      });
    },
    chatMessage: function(data) {
      this.chatMessages.push({
        username: data.userName,
        message: data.msg,
        bgColor: "badge-warning",
        isNotification: false,
        floatSide: ""
      });
    },
    userTyping: function(userName) {
      this.userIsTyping = userName + " is typing..";
      setTimeout(() => {
        this.userIsTyping = "";
      }, 2000);
    }
  },
  created() {
    this.chatMessages.push({
      username: "",
      message: "Welcome!",
      bgColor: "",
      isNotification: true,
      floatSide: ""
    });
  }
};
</script>

<style scoped>
.chat-msg {
  max-width: 90%;
}

form {
  position: fixed;
  bottom: 0;
  width: 100%;
}

input {
  height: 100px;
}
</style>