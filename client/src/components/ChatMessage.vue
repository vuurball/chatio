<template>
  <div class="container mt-2">
    <div class="row" :class="msg.floatSide">
      <h1 class="chat-msg">
        <span v-if="msg.isNotification" class="badge text-wrap pt-3" :class="msg.bgColor">
          <p class="font-weight-lighter">{{ msg.message }}</p>
        </span>

        <span v-else class="badge text-left text-wrap pt-3 px-4" :class="msg.bgColor">
          <p v-if="msg.username" class="font-weight-lighter">{{ msg.username }}</p>
          <p>{{ msg.message }}</p>
        </span>
      </h1>
    </div>
  </div>
</template>


<script>
export default {
  name: "ChatMessage",
  props: ["msg"],
  methods: {}
};
</script>

<style scoped>
.chat-msg {
  max-width: 90%;
  font-size: 30px;
}
</style>