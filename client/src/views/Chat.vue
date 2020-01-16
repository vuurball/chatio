<template>
  <MainChat msg="Welcome to Chatio" />
</template>

<script>
// @ is an alias to /src
import MainChat from "@/components/MainChat.vue";

export default {
  name: "chat",
  components: {
    MainChat
  }
};
</script>
