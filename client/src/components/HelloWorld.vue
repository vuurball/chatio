<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    Chat: {{ this.chatStatus }}
    <ul class="list-group">
      <li v-for="(msg, i) in chatMessages" :key="i" class="list-group-item">{{ msg }}</li>
    </ul>
    <form @submit.prevent="sendMessage" class="form-inline">
      <input
        v-model="chatInput"
        class="form-control form-control-lg col-10"
        type="text"
        autocomplete="off"
        placeholder="say something.."
      />
      <button type="submit" class="btn btn-primary form-control-lg col-1">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      chatStatus: "Disconnected",
      chatInput: "",
      chatMessages: ["1", "2"]
    };
  },
  methods: {
    sendMessage() {
      this.chatMessages.push(this.chatInput);
      this.$socket.emit("chatMessage", this.chatInput);
      this.chatInput = "";
    }
  },
  props: {
    msg: String
  },
  sockets: {
    connect: function() {
      this.chatStatus = "Connected";
    },
    chatMessage: function(msg) {
      this.chatMessages.push(msg);
    },
    hi: function(data) {
      this.chatStatus = data;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

form {
  background: rgba(6, 241, 84, 0.979);
  padding: 3px;
  position: fixed;
  bottom: 0;
  width: 100%;
  font-size: 40px;
}
form input {
  border: 0;
  padding: 10px;
  width: 90%;
  margin-right: 0.5%;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

#messages li {
  padding: 5px 10px;
}
#messages li:nth-child(odd) {
  background: #eee;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
